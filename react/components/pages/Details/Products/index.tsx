import React, { Component } from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { graphql } from 'react-apollo'

import QUERY from '../../../../graphql/products/subscriptionGroupProducts.gql'
import { SubscriptionStatusEnum } from '../../../../constants'
import Edition from './Edition'
import Listing from './Listing'

class ProductsContainer extends Component<InnerProps & OutterProps> {
  state = {
    isEditMode: false,
    isLoading: false,
  }

  handleEdit = () => {
    this.setState({ isEditMode: true })
  }

  handleCancel = () => {
    this.setState({ isEditMode: false })
  }

  handleSave = () => {
    console.log('SAVED')
  }

  render() {
    const {
      data: { groupedSubscription },
    } = this.props
    const { isEditMode, isLoading } = this.state

    return isEditMode ? (
      <Edition
        isLoading={isLoading}
        onSave={this.handleSave}
        onCancel={this.handleCancel}
      />
    ) : (
      <Listing
        onEdit={this.handleEdit}
        subscriptionStatus={groupedSubscription.status}
        products={groupedSubscription.subscriptions}
        currency={groupedSubscription.purchaseSettings.currencySymbol}
      />
    )
  }
}

interface InnerProps {
  data: {
    loading: boolean
    groupedSubscription: {
      orderGroup: string
      status: SubscriptionStatusEnum
      subscriptions: SubscriptionProduct[]
      purchaseSettings: {
        currencySymbol: string
      }
    }
  }
}

export interface SubscriptionProduct {
  subscriptionId: string
  sku: {
    skuId: string
    name: string
    productName: string
    imageUrl: string
    detailUrl: string
    nameComplete: string
  }
  quantity: number
  priceAtSubscriptionDate: number
}

interface OutterProps {
  orderGroup: string
}

const enhance = compose<InnerProps & OutterProps, OutterProps>(
  graphql(QUERY),
  branch<InnerProps>(({ data: { loading } }) => loading, renderNothing)
)

export default enhance(ProductsContainer)
