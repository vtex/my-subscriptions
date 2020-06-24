import React, { Component } from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import {
  ModalDialog,
  CheckboxGroup,
  withToast,
  ShowToastArgs,
  Alert,
} from 'vtex.styleguide'

import { Subscription, INSTANCE } from '.'
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
import { queryWrapper } from '../../tracking'
import { messages as modalMessages } from '../ConfirmationModal'
import Thumbnail from '../Thumbnail'

const messages = defineMessages({
  success: {
    id: 'store/subscription.edit.success',
    defaultMessage: '',
  },
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
  },
})

class BatchModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const selectionItems: State['selectionItems'] = {}

    if (props.targetSubscriptions.size === 0) {
      // props.onClose()
    } else {
      props.targetSubscriptions.forEach((subs) => {
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
    }

    this.state = {
      selectionItems,
      loading: false,
      displayError: false,
    }
  }

  // private handleFailure = (id: string) =>
  //   this.setState(({ selectionItems }) => {
  //     const newMap = new Map(selectionItems)

  //     newMap.set(id, { selected: true, loading: false })

  //     return {
  //       selectionItems: newMap,
  //     }
  //   })

  private handleCloseError = () => this.setState({ displayError: false })

  private handleSuccess = (id: string) =>
    this.setState(({ selectionItems }) => {
      delete selectionItems[id]

      return {
        selectionItems,
      }
    })

  private handleSubmit = () => {
    const {
      option,
      updateAddress,
      updatePayment,
      currentSubscription,
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

    let promises: Promise<any>
    if (option === 'ADDRESS') {
      promises = Promise.all(
        selectedIds.map((id) =>
          updateAddress({
            variables: {
              subscriptionId: id,
              addressId: currentSubscription.shippingAddress?.id as string,
              addressType: currentSubscription.shippingAddress
                ?.addressType as string,
            },
          }).then(() => this.handleSuccess(id))
        )
      )
    } else {
      promises = Promise.all(
        selectedIds.map((id) =>
          updatePayment({
            variables: {
              subscriptionId: id,
              paymentSystemId: currentSubscription.purchaseSettings
                .paymentMethod?.paymentSystemId as string,
              paymentAccountId:
                currentSubscription.purchaseSettings.paymentMethod
                  ?.paymentAccount?.id,
            },
          }).then(() => this.handleSuccess(id))
        )
      )
    }

    promises
      .then(() => {
        onClose()
        showToast({ message: intl.formatMessage(messages.success) })
      })
      .finally(() => {
        this.setState({ loading: false })
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
      >
        <form className="t-body" onSubmit={this.handleSubmit}>
          <h5 className="t-heading-5">
            Would you like to apply this change for these other subscriptions as
            well?
          </h5>
          {displayError && (
            <div className="mb5">
              <Alert type="error" onClose={this.handleCloseError}>
                {modalMessages.errorMessage}
              </Alert>
            </div>
          )}
          <CheckboxGroup
            name="selectedSubscriptions"
            id="selectedSubscriptions"
            label="All Subscriptions"
            value=""
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
  selectionItems: { [key: string]: { label: any; checked: boolean } }
  loading: boolean
  displayError: boolean
}

interface MappedProps {
  targetSubscriptions: Map<string, TargetSubscripton>
  loading: boolean
}

type InnerProps = InjectedIntlProps &
  MappedProps & {
    updateAddress: (args: { variables: UpdateAddressArgs }) => Promise<void>
    updatePayment: (args: { variables: UpdatePaymentArgs }) => Promise<void>
    showToast: (args: ShowToastArgs) => void
  }

interface OuterProps extends Args {
  currentSubscription: Subscription
  onClose: () => void
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  queryWrapper<OuterProps, Result, Args, MappedProps>(
    `${INSTANCE}/ListBy`,
    QUERY,
    {
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        targetSubscriptions: data?.list
          ? data.list.reduce(
              (map, subs) => map.set(subs.id, subs),
              new Map<string, TargetSubscripton>()
            )
          : new Map<string, TargetSubscripton>(),
      }),
    }
  ),
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
