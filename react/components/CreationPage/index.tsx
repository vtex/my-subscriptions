import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import Products from './Products'
import { OnAddItemArgs } from '../AddItemModal'

class SubscriptionCreationContainer extends Component<Props, State> {
  public state = {
    products: [],
    currentPlan: null,
  }

  private handleRemoveItem = (skuId: string) =>
    this.setState(({ products, currentPlan }) => {
      const index = products.findIndex((product) => product.skuId === skuId)

      if (index >= 0) products.splice(index, 1)

      return {
        products,
        currentPlan: products.length === 0 ? null : currentPlan,
      }
    })

  private handleUpdateQuantity = ({
    skuId,
    quantity,
  }: {
    skuId: string
    quantity: number
  }) =>
    this.setState(({ products }) => {
      const index = products.findIndex((product) => product.skuId === skuId)

      if (index >= 0) {
        products[index].quantity = quantity
      }

      return {
        products,
      }
    })

  private handleAddItem = ({
    onError,
    onFinish,
    plans,
    ...productArgs
  }: OnAddItemArgs) =>
    this.setState(({ products, currentPlan }) => {
      products.push({
        ...productArgs,
      })

      onFinish()

      return currentPlan
        ? {
            products,
            currentPlan,
          }
        : {
            products,
            currentPlan: plans[0],
          }
    })

  public render() {
    const { history } = this.props
    const { products, currentPlan } = this.state

    return (
      <>
        <Header
          title={
            <span className="normal">
              <FormattedMessage
                id="store/creation-page.title"
                defaultMessage="New subscription"
              />
            </span>
          }
          linkLabel={
            <FormattedMessage
              id="store/creation-page.back-button"
              defaultMessage="All subscriptions"
            />
          }
          onLinkClick={() => history.push('/subscriptions')}
        />
        <div className="pa5 pa7-l flex flex-wrap">
          <div className="w-100 w-60-l">
            <Products
              products={products}
              onAddItem={this.handleAddItem}
              onRemoveItem={this.handleRemoveItem}
              onUpdateQuantity={this.handleUpdateQuantity}
              currentPlan={currentPlan}
              currency=""
            />
          </div>
          <div className="w-100 w-40-l pt6 pt0-l pl0 pl6-l" />
        </div>
      </>
    )
  }
}

export type Product = {
  skuId: string
  name: string
  price: number
  unitMultiplier: number
  measurementUnit: string
  brand: string
  imageUrl: string
  quantity: number
}

type State = {
  products: Product[]
  currentPlan: string | null
}

type Props = RouteComponentProps

export default withRouter(SubscriptionCreationContainer)
