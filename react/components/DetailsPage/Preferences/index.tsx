import React, { Component } from 'react'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Display from './DisplayData'
import Edit from './Edit'
import { frequencyIndex } from './utils'

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
    }
  }

  private handleClose = () => this.setState({ isEditMode: false })

  private handleSave = () => null

  private handleDismissError = () => this.setState({ errorMessage: null })

  private handleChangeFrequency = (selectedFrequency: string) =>
    this.setState({ selectedFrequency })

  private handleChangePurchaseDay = (selectedPurchaseDay: string) =>
    this.setState({ selectedPurchaseDay })

  private handleGoToEdition = () => this.setState({ isEditMode: true })

  public render() {
    const { plan, address, payment, subscriptionId } = this.props
    const {
      isEditMode,
      isLoading,
      errorMessage,
      selectedFrequency,
      selectedPurchaseDay,
    } = this.state

    return (
      <>
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
}

type Props = {
  subscriptionId: string
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
}

export default PreferencesContainer
