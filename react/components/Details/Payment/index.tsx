import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
// eslint-disable-next-line no-restricted-imports
import { path } from 'ramda'
import qs from 'query-string'
import { ApolloError } from 'apollo-client'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { PaymentSystemGroup } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import MUTATION, {
  Args,
} from '../../../graphql/mutations/updatePaymentMethod.gql'
import {
  EditOptions,
  PAYMENT_DIV_ID,
  BASIC_CARD_WRAPPER,
  CSS,
} from '../../../constants'
import {
  getEditOption,
  scrollToElement,
  removeElementsFromSearch,
} from '../../../utils'
import EditPayment from './EditPayment'
import PaymentCard from './PaymentCard'
import { Subscription } from '..'
import { logGraphqlError } from '../../../tracking'
import BatchModal from '../BatchModal'

function hasEditOption(location: RouteComponentProps['location']) {
  const option = getEditOption(location)

  return option === EditOptions.Payment
}

function newPaymentArgs(location: RouteComponentProps['location']) {
  const args = qs.parse(location.search)

  if (args.newPaymentAccountId && args.newPaymentSystemId) {
    return {
      selectedAccountId: args.newPaymentAccountId,
      selectedPaymentSystemId: args.newPaymentSystemId,
      selectedPaymentSystemGroup: 'creditCard' as PaymentSystemGroup,
      isEditMode: true,
    }
  }

  return null
}

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

class SubscriptionPaymentContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedAccountId:
        path(
          [
            'subscription',
            'purchaseSettings',
            'paymentMethod',
            'paymentAccount',
            'id',
          ],
          props
        ) ?? null,
      errorMessage: '',
      isEditMode: false,
      isLoading: false,
      isRetryButtonEnabled: true,
      selectedPaymentSystemId:
        path(
          [
            'subscription',
            'purchaseSettings',
            'paymentMethod',
            'paymentSystemId',
          ],
          props
        ) ?? null,
      selectedPaymentSystemGroup:
        path(
          [
            'subscription',
            'purchaseSettings',
            'paymentMethod',
            'paymentSystemGroup',
          ],
          props
        ) ?? 'creditCard',
      showAlert: false,
      isBatchModalOpen: false,
      previousAccountId: null,
    }
  }

  public componentDidMount = () => {
    const hasEdited = this.verifyEdit()

    if (!hasEdited) {
      this.verifyNewPayment()
    }
  }

  private verifyEdit = () => {
    const { location } = this.props
    const shouldOpenEdit = hasEditOption(location)

    if (shouldOpenEdit) {
      this.setState({ isEditMode: shouldOpenEdit }, () => {
        scrollToElement(PAYMENT_DIV_ID)

        const search = removeElementsFromSearch(['edit'], location)

        this.props.history.push({
          search,
        })
      })
    }

    return shouldOpenEdit
  }

  private verifyNewPayment = () => {
    const { location, history } = this.props
    const args = newPaymentArgs(location)

    if (args) {
      this.setState({ ...args }, () => {
        scrollToElement(PAYMENT_DIV_ID)

        const search = removeElementsFromSearch(
          ['newPaymentAccountId', 'newPaymentSystemId'],
          location
        )

        history.push({
          search,
        })

        this.handleSave()
      })
    }
  }

  private handleMakeRetry = () =>
    this.props.onMakeRetry().then(() =>
      this.setState({
        isRetryButtonEnabled: false,
      })
    )

  private handleEdit = () => {
    this.setState({ isEditMode: true })
  }

  private handleCancel = () => {
    this.setState({ isEditMode: false })
  }

  private handleSave = () => {
    const { updatePayment, subscription, intl, showToast } = this.props
    const {
      selectedPaymentSystemGroup,
      selectedAccountId,
      selectedPaymentSystemId,
    } = this.state

    this.setState({
      isLoading: true,
      previousAccountId: subscription.paymentAccountId ?? null,
    })

    const variables: Args = {
      paymentAccountId:
        selectedPaymentSystemGroup === 'creditCard' ? selectedAccountId : null,
      subscriptionId: subscription.id,
      paymentSystemId: selectedPaymentSystemId as string,
    }

    return updatePayment({
      variables,
    })
      .then(() => {
        showToast({
          message: intl.formatMessage(messages.success),
        })
        this.setState({
          isEditMode: false,
          isLoading: false,
          isBatchModalOpen: !!selectedAccountId,
        })
      })
      .catch((e: ApolloError) => {
        logGraphqlError({
          error: e,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'UpdatePayment',
        })
        this.setState({
          errorMessage: intl.formatMessage(messages.errorMessage),
          isLoading: false,
          showAlert: true,
        })
      })
  }

  private handleCloseAlert = () => {
    this.setState({
      showAlert: false,
    })
  }

  private handlePaymentGroupChange = (
    newGroup: PaymentSystemGroup,
    paymentSystemId?: string
  ) =>
    this.setState({
      selectedPaymentSystemGroup: newGroup,
      selectedPaymentSystemId: paymentSystemId ?? null,
    })

  private handlePaymentChange = (
    newPaymentSystemId: string,
    newAccountID?: string
  ) =>
    this.setState({
      selectedPaymentSystemId: newPaymentSystemId,
      selectedAccountId: newAccountID ?? null,
    })

  private handleOnCloseBatch = () => this.setState({ isBatchModalOpen: false })

  public render() {
    const { subscription, displayRetry } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAccountId,
      selectedPaymentSystemGroup,
      showAlert,
      isRetryButtonEnabled,
      isBatchModalOpen,
      previousAccountId,
    } = this.state

    return (
      <div
        className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}
        id={PAYMENT_DIV_ID}
      >
        {isEditMode ? (
          <EditPayment
            onSave={this.handleSave}
            onCancel={this.handleCancel}
            onChangePayment={this.handlePaymentChange}
            onChangePaymentGroup={this.handlePaymentGroupChange}
            onCloseAlert={this.handleCloseAlert}
            paymentSystemGroup={selectedPaymentSystemGroup}
            showAlert={showAlert}
            errorMessage={this.state.errorMessage}
            accountId={selectedAccountId}
            isLoading={isLoading}
          />
        ) : (
          <>
            {isBatchModalOpen && previousAccountId && (
              <BatchModal
                onClose={this.handleOnCloseBatch}
                currentSubscription={subscription}
                option="PAYMENT"
                value={previousAccountId}
              />
            )}
            <PaymentCard
              onEdit={this.handleEdit}
              subscription={subscription}
              onMakeRetry={this.handleMakeRetry}
              displayRetry={displayRetry}
              isRetryButtonEnabled={isRetryButtonEnabled}
            />
          </>
        )}
      </div>
    )
  }
}

interface OuterProps {
  subscription: Subscription
  onMakeRetry: () => Promise<void>
  displayRetry: boolean
}

interface InnerProps
  extends WrappedComponentProps,
    RouteComponentProps,
    InjectedRuntimeContext {
  updatePayment: (args: { variables: Args }) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
}

type Props = InnerProps & OuterProps

interface State {
  selectedAccountId: string | null
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  isRetryButtonEnabled: boolean
  selectedPaymentSystemId: string | null
  selectedPaymentSystemGroup: PaymentSystemGroup
  showAlert: boolean
  isBatchModalOpen: boolean
  previousAccountId: string | null
}

export default compose<Props, OuterProps>(
  injectIntl,
  withToast,
  withRouter,
  graphql(MUTATION, {
    name: 'updatePayment',
  }),
  withRuntimeContext
)(SubscriptionPaymentContainer)
