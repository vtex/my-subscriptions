import React, { Component } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import {
  SubscriptionExecutionStatus,
  PaymentSystemGroup,
} from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { withToast, ShowToastArgs } from 'vtex.styleguide'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Display from './DisplayData'
import Edit from './Edit'
import { frequencyIndex, extractFrequency } from './utils'
import UPDATE_FREQUENCY, {
  Args as UpdateFrequencyArgs,
} from '../../../graphql/mutations/updatePlan.gql'
import UPDATE_PAYMENT, {
  Args as UpdatePaymentArgs,
} from '../../../graphql/mutations/updatePaymentMethod.gql'
import UPDATE_ADDRESS, {
  Args as UpdateAddressArgs,
} from '../../../graphql/mutations/updateAddress.gql'
import { logGraphqlError } from '../../../tracking'
import BatchModal from '../BatchModal'

function updateType(
  args: UpdateFrequencyArgs | UpdatePaymentArgs | UpdateAddressArgs
) {
  if ((args as UpdateFrequencyArgs).periodicity) {
    return 'Frequency'
  }
  if ((args as UpdatePaymentArgs).paymentSystemId) {
    return 'Payment'
  }
  return 'Address'
}

const messages = defineMessages({
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
  },
  success: {
    id: 'store/subscription.edit.success',
  },
})

class PreferencesContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { plan } = props
    const { interval, periodicity } = plan.frequency

    this.state = {
      isEditMode: true,
      isLoading: false,
      errorMessage: null,
      selectedFrequency: frequencyIndex({ interval, periodicity }),
      selectedPurchaseDay: plan.purchaseDay,
      selectedPaymentAccountId:
        props.payment.paymentMethod?.paymentAccount?.id ?? null,
      selectedPaymentSystemId:
        props.payment.paymentMethod?.paymentSystemId ?? null,
      selectedPaymentSystemGroup:
        props.payment.paymentMethod?.paymentSystemGroup ?? null,
      selectedAddress: props.address
        ? { id: props.address.id, type: props.address.addressType as string }
        : null,
      previousAccountId: null,
      previousAddressId: null,
      isAddressModalOpen: false,
      isPaymentModalOpen: false,
    }
  }

  private handleClose = () => this.setState({ isEditMode: false })

  private handleDismissError = () => this.setState({ errorMessage: null })

  private handleChangeFrequency = (selectedFrequency: string) =>
    this.setState({ selectedFrequency })

  private handleChangePurchaseDay = (selectedPurchaseDay: string) =>
    this.setState({ selectedPurchaseDay })

  private handleGoToEdition = () => this.setState({ isEditMode: true })

  private handleChangePaymentSystemGroup = ({
    group,
    paymentSystemId,
  }: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) =>
    this.setState({
      selectedPaymentSystemGroup: group,
      selectedPaymentSystemId: paymentSystemId ?? null,
    })

  private handleChangePaymentAccount = ({
    paymentAccountId,
    paymentSystemId,
  }: {
    paymentAccountId: string
    paymentSystemId: string
  }) =>
    this.setState({
      selectedPaymentSystemId: paymentSystemId,
      selectedPaymentAccountId: paymentAccountId,
    })

  private handleChangeAddress = ({
    addressId,
    addressType,
  }: {
    addressId: string
    addressType: string
  }) =>
    this.setState({
      selectedAddress: { id: addressId, type: addressType },
    })

  private handleFailure = (
    error: ApolloError,
    variables: UpdateAddressArgs | UpdatePaymentArgs | UpdateFrequencyArgs
  ) => {
    const { runtime } = this.props

    logGraphqlError({
      error,
      variables,
      runtime,
      type: 'MutationError',
      instance: `Update${updateType(variables)}`,
    })

    throw error
  }

  private handleClosePaymentModal = () =>
    this.setState({ isPaymentModalOpen: false })

  private handleCloseAddressModal = () =>
    this.setState({ isAddressModalOpen: false })

  private handleSave = () => {
    const {
      address,
      updateAddress,
      subscriptionId,
      plan,
      updateFrequency,
      payment,
      updatePayment,
      intl,
      showToast,
      currentAddressId,
      currentPaymentAccountId,
    } = this.props
    const {
      selectedAddress,
      selectedFrequency,
      selectedPurchaseDay,
      selectedPaymentSystemId,
      selectedPaymentAccountId,
    } = this.state
    const promises: Array<Promise<void>> = []

    if (selectedAddress && selectedAddress.id !== address?.id) {
      const variables = {
        subscriptionId,
        addressId: selectedAddress.id,
        addressType: selectedAddress.type,
      }

      this.setState({
        previousAddressId: currentAddressId,
      })

      promises.push(
        updateAddress({
          variables,
        })
          .then(() => this.setState({ isAddressModalOpen: true }))
          .catch((e: ApolloError) => this.handleFailure(e, variables))
      )
    }

    const currentFrequency = extractFrequency(selectedFrequency)
    if (
      plan.purchaseDay !== selectedPurchaseDay ||
      currentFrequency.interval !== plan.frequency.interval ||
      currentFrequency.periodicity !== plan.frequency.periodicity
    ) {
      const variables = {
        subscriptionId,
        periodicity: currentFrequency.periodicity,
        interval: currentFrequency.interval,
        purchaseDay: selectedPurchaseDay,
      }

      promises.push(
        updateFrequency({
          variables,
        }).catch((e: ApolloError) => this.handleFailure(e, variables))
      )
    }

    if (
      selectedPaymentSystemId &&
      (payment.paymentMethod?.paymentSystemId !== selectedPaymentSystemId ||
        payment.paymentMethod.paymentAccount?.id !== selectedPaymentAccountId)
    ) {
      const variables = {
        subscriptionId,
        paymentSystemId: selectedPaymentSystemId,
        paymentAccountId: selectedPaymentAccountId,
      }

      this.setState({
        previousAccountId: currentPaymentAccountId,
      })

      promises.push(
        updatePayment({ variables })
          .then(() => this.setState({ isPaymentModalOpen: true }))
          .catch((e: ApolloError) => this.handleFailure(e, variables))
      )
    }

    this.setState({ isLoading: true })

    Promise.all(promises)
      .then(() => {
        showToast({ message: intl.formatMessage(messages.success) })
        this.setState({ isEditMode: false })
      })
      .catch(() =>
        this.setState({
          errorMessage: intl.formatMessage(messages.errorMessage),
        })
      )
      .finally(() => this.setState({ isLoading: false }))
  }

  public render() {
    const { plan, address, payment, subscriptionId } = this.props
    const {
      isEditMode,
      isLoading,
      errorMessage,
      selectedFrequency,
      selectedPurchaseDay,
      selectedPaymentSystemGroup,
      selectedPaymentAccountId,
      selectedAddress,
      isPaymentModalOpen,
      previousAccountId,
      isAddressModalOpen,
      previousAddressId,
    } = this.state

    return (
      <>
        {isPaymentModalOpen && previousAccountId && (
          <BatchModal
            currentSubscriptionId={subscriptionId}
            currentValues={{
              paymentAccountId: payment.paymentMethod?.paymentAccount
                ?.id as string,
              paymentSystemId: payment.paymentMethod?.paymentSystemId as string,
            }}
            onClose={this.handleClosePaymentModal}
            option="PAYMENT"
            value={previousAccountId}
          />
        )}
        {isAddressModalOpen && previousAddressId && (
          <BatchModal
            currentSubscriptionId={subscriptionId}
            currentValues={{
              addressId: address?.id as string,
              addressType: address?.addressType as string,
            }}
            onClose={this.handleCloseAddressModal}
            option="ADDRESS"
            value={previousAddressId}
          />
        )}
        {isEditMode ? (
          <Edit
            subscriptionId={subscriptionId}
            plan={plan}
            isLoading={isLoading}
            onCancel={this.handleClose}
            onSave={this.handleSave}
            errorMessage={errorMessage}
            onDismissError={this.handleDismissError}
            onChangeFrequency={this.handleChangeFrequency}
            selectedFrequency={selectedFrequency}
            onChangePurchaseDay={this.handleChangePurchaseDay}
            selectedPurchaseDay={selectedPurchaseDay}
            selectedPaymentSystemGroup={selectedPaymentSystemGroup}
            selectedPaymentAccountId={selectedPaymentAccountId}
            onChangePaymentSystemGroup={this.handleChangePaymentSystemGroup}
            onChangePaymentAccount={this.handleChangePaymentAccount}
            selectedAddressId={selectedAddress?.id ?? null}
            onChangeAddress={this.handleChangeAddress}
          />
        ) : (
          <Display
            plan={plan}
            address={address}
            payment={payment}
            onGoToEdition={this.handleGoToEdition}
          />
        )}
      </>
    )
  }
}

type State = {
  isEditMode: boolean
  isLoading: boolean
  errorMessage: string | null
  selectedPurchaseDay: string
  selectedFrequency: string
  selectedPaymentSystemGroup: PaymentSystemGroup | null
  selectedPaymentSystemId: string | null
  selectedPaymentAccountId: string | null
  selectedAddress: { id: string; type: string } | null
  previousAccountId: string | null
  previousAddressId: string | null
  isAddressModalOpen: boolean
  isPaymentModalOpen: boolean
}

type OuterProps = {
  subscriptionId: string
  currentAddressId: string | null
  currentPaymentAccountId: string | null
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
}

type InnerProps = {
  updateFrequency: (args: { variables: UpdateFrequencyArgs }) => Promise<void>
  updatePayment: (args: { variables: UpdatePaymentArgs }) => Promise<void>
  updateAddress: (args: { variables: UpdateAddressArgs }) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
} & InjectedRuntimeContext &
  WrappedComponentProps

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  withRuntimeContext,
  withToast,
  injectIntl,
  graphql(UPDATE_FREQUENCY, { name: 'updateFrequency' }),
  graphql(UPDATE_PAYMENT, {
    name: 'updatePayment',
  }),
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  })
)

export default enhance(PreferencesContainer)
