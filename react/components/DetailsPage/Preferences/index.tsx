import React, { Component } from 'react'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Display from './DisplayData'
import Edit from './Edit'

class PreferencesContainer extends Component<Props, State> {
  public state = {
    isEditMode: true,
    isLoading: false,
    errorMessage: null,
  }

  private handleClose = () => this.setState({ isEditMode: false })

  private handleSave = () => null

  private handleDismissError = () => this.setState({ errorMessage: null })

  public render() {
    const { plan, address, payment, subscriptionId } = this.props
    const { isEditMode, isLoading, errorMessage } = this.state

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
          />
        ) : (
          <Display plan={plan} address={address} payment={payment} />
        )}
      </>
    )
  }
}

type State = {
  isEditMode: boolean
  isLoading: boolean
  errorMessage: string | null
}

type Props = {
  subscriptionId: string
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
}

export default PreferencesContainer
