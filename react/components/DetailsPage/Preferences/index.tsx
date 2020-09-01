import React, { Component } from 'react'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Display from './DisplayData'
import Edit from './Edit'

class PreferencesContainer extends Component<Props> {
  public state = {
    isEditMode: true,
    isLoading: false,
  }

  private handleClose = () => this.setState({ isEditMode: false })

  private handleSave = () => null

  public render() {
    const { plan, address, payment, subscriptionId } = this.props
    const { isEditMode, isLoading } = this.state

    return (
      <>
        {isEditMode ? (
          <Edit
            subscriptionId={subscriptionId}
            plan={plan}
            isLoading={isLoading}
            onCancel={this.handleClose}
            onSave={this.handleSave}
          />
        ) : (
          <Display plan={plan} address={address} payment={payment} />
        )}
      </>
    )
  }
}

type Props = {
  subscriptionId: string
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
}

export default PreferencesContainer
