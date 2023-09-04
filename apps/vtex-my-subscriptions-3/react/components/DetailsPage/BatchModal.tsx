import React, { Component, ReactNode } from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import {
  ModalDialog,
  CheckboxGroup,
  withToast,
  ShowToastArgs,
  Alert,
} from 'vtex.styleguide'

import QUERY, {
  Args,
  Result,
  Subscription as TargetSubscripton,
} from '../../graphql/queries/listBy.gql'
import UPDATE_ADDRESS, {
  Args as UpdateAddressArgs,
} from '../../graphql/mutations/updateAddress.gql'
import UPDATE_PAYMENT, {
  Args as UpdatePaymentArgs,
} from '../../graphql/mutations/updatePaymentMethod.gql'
import {
  withQueryWrapper,
  logGraphQLError,
  getRuntimeInfo,
} from '../../tracking'
import { messages as modalMessages } from '../ConfirmationModal'
import Thumbnail from './SubscriptionThumbnail'

const messages = defineMessages({
  success: {
    id: 'subscription.edit.success',
  },
  errorMessage: {
    id: 'subscription.fallback.error.message',
  },
  all: {
    id: 'subscription.batch.modal.all',
  },
  description: {
    id: 'subscription.batch.modal.desc',
  },
})

function isAddress(args: Props['currentValues']): args is AddressArgs {
  return (args as AddressArgs).addressId !== undefined
}

function isPayment(args: Props['currentValues']): args is PaymentArgs {
  return (args as PaymentArgs).paymentAccountId !== undefined
}

class BatchModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const selectionItems: State['selectionItems'] = {}

    props.targetSubscriptions.forEach((subs) => {
      // Remove the current subscription from the list, because it isnt indexed yet
      // with the new id.
      if (subs.id === props.currentSubscriptionId) return

      const skus = subs.items.map((item) => item.sku)
      selectionItems[subs.id] = {
        label: (
          <Thumbnail
            skus={skus}
            name={subs.name}
            periodicity={subs.plan.frequency.periodicity}
            interval={subs.plan.frequency.interval}
            purchaseDay={subs.plan.purchaseDay}
          />
        ),
        checked: true,
      }
    })

    if (Object.keys(selectionItems).length === 0) {
      props.onClose()
    }

    this.state = {
      selectionItems,
      loading: false,
      displayError: false,
      completed: [],
    }
  }

  private handleFailure = (
    error: ApolloError,
    variables: UpdateAddressArgs | UpdatePaymentArgs
  ) => {
    const { option } = this.props

    logGraphQLError({
      error,
      variables,
      runtimeInfo: getRuntimeInfo(),
      type: 'MutationError',
      instance: `Batch/Update${option === 'ADDRESS' ? 'Address' : 'Payment'}`,
    })
  }

  private handleCloseError = () => this.setState({ displayError: false })

  private handleSuccess = (id: string) =>
    this.setState(({ completed }) => {
      completed.push(id)

      return {
        completed,
      }
    })

  private handleSubmit = () => {
    const {
      option,
      updateAddress,
      updatePayment,
      currentValues,
      onClose,
      showToast,
      intl,
    } = this.props
    const { selectionItems } = this.state

    const selectedIds: string[] = []

    Object.keys(selectionItems).forEach((key) => {
      if (selectionItems[key].checked) {
        selectedIds.push(key)
      }
    })

    this.setState({ loading: true })

    let promises: Promise<unknown> | null = null
    if (option === 'ADDRESS' && isAddress(currentValues)) {
      promises = Promise.all(
        selectedIds.map((id) => {
          const variables = {
            subscriptionId: id,
            addressId: currentValues.addressId,
            addressType: currentValues.addressType,
          }

          return updateAddress({
            variables,
          })
            .then(() => this.handleSuccess(id))
            .catch((e: ApolloError) => this.handleFailure(e, variables))
        })
      )
    } else if (isPayment(currentValues)) {
      promises = Promise.all(
        selectedIds.map((id) => {
          const variables = {
            subscriptionId: id,
            paymentSystemId: currentValues.paymentSystemId,
            paymentAccountId: currentValues.paymentAccountId,
          }

          return updatePayment({
            variables,
          })
            .then(() => this.handleSuccess(id))
            .catch((e: ApolloError) => this.handleFailure(e, variables))
        })
      )
    }

    promises?.then(() => {
      // timeout added due to state not update instantaneously
      setTimeout(() => {
        // filter only unique completed ids
        const uniqueCompletedIds = this.state.completed.filter((completed, index) => this.state.completed.indexOf(completed) === index);

        const displayError = uniqueCompletedIds.length !== selectedIds.length

        if (!displayError) {
          showToast({ message: intl.formatMessage(messages.success) })
          onClose()
        } else {
          this.setState((finalState) => {
            finalState.completed.map((id) => delete finalState.selectionItems[id])

            return {
              selectionItems: finalState.selectionItems,
              loading: false,
              // If some subscription isn't on the finalState
              // it means that some error has ocurred
              displayError,
            }
          })
        }
      }, 100)
    })
  }

  public render() {
    const { onClose, intl } = this.props
    const { selectionItems, loading, displayError } = this.state

    return (
      <ModalDialog
        centered
        isOpen
        loading={loading}
        onClose={onClose}
        confirmation={{
          label: intl.formatMessage(modalMessages.confirmationLabel),
          onClick: this.handleSubmit,
        }}
        cancelation={{
          label: intl.formatMessage(modalMessages.cancelationLabel),
          onClick: this.props.onClose,
        }}
        container={window.top.document.body}
      >
        <form className="t-body" onSubmit={this.handleSubmit}>
          <h5 className="t-heading-5">
            {intl.formatMessage(messages.description)}
          </h5>
          {displayError && (
            <div className="mb5">
              <Alert type="error" onClose={this.handleCloseError}>
                {intl.formatMessage(modalMessages.errorMessage)}
              </Alert>
            </div>
          )}
          <CheckboxGroup
            name="selectedSubscriptions"
            id="selectedSubscriptions"
            label={intl.formatMessage(messages.all)}
            value=""
            disabled={loading}
            checkedMap={selectionItems}
            onGroupChange={(newCheckedMap: State['selectionItems']) =>
              this.setState({ selectionItems: newCheckedMap })
            }
          />
          <input className="dn" type="submit" />
        </form>
      </ModalDialog>
    )
  }
}

interface State {
  selectionItems: { [key: string]: { label: ReactNode; checked: boolean } }
  loading: boolean
  displayError: boolean
  completed: string[]
}

interface MappedProps {
  targetSubscriptions: TargetSubscripton[]
  loading: boolean
}

type InnerProps = WrappedComponentProps &
  MappedProps & {
    updateAddress: (args: { variables: UpdateAddressArgs }) => Promise<void>
    updatePayment: (args: { variables: UpdatePaymentArgs }) => Promise<void>
    showToast: (args: ShowToastArgs) => void
  }

type AddressArgs = { addressId: string; addressType: string }
type PaymentArgs = { paymentAccountId: string; paymentSystemId: string }

interface OuterProps extends Args {
  currentSubscriptionId: string
  currentValues: AddressArgs | PaymentArgs
  onClose: () => void
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  withQueryWrapper<OuterProps, Result, Args, MappedProps>({
    getRuntimeInfo,
    workflowInstance: 'SubscriptionsDetails/ListBy',
    document: QUERY,
    operationOptions: {
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        targetSubscriptions: data?.list ? data.list : [],
      }),
    },
  }),
  branch<Props>(({ loading }) => loading, renderNothing),
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  }),
  graphql(UPDATE_PAYMENT, {
    name: 'updatePayment',
  }),
  withToast,
  injectIntl
)

export default enhance(BatchModal)
