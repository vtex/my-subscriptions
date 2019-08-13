import React, { Component, Fragment } from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { graphql } from 'react-apollo'

import QUERY from '../../../../graphql/products/subscriptionGroupProducts.gql'
import { SubscriptionStatusEnum } from '../../../../constants'
import ConfirmationModal from '../../../commons/ConfirmationModal'
import Listing from './Listing'

function mapSubscriptionsToHashMap(subscriptions: SubscriptionProduct[]) {
  return subscriptions.reduce(
    (previous, current) => ({
      ...previous,
      [current.subscriptionId]: current,
    }),
    {}
  )
}

class ProductsContainer extends Component<InnerProps & OutterProps, State> {
  public constructor(props: InnerProps & OutterProps) {
    super(props)

    const products = mapSubscriptionsToHashMap(
      props.data.groupedSubscription.subscriptions
    )

    this.state = {
      selectedSubscription: '',
      isEditMode: false,
      isLoading: false,
      isModalOpen: false,
      products,
    }
  }

  private handleLoading = (value: boolean) => {
    this.setState({ isLoading: value })
  }

  private handleGoToEdition = () => {
    this.setState({ isEditMode: true })
  }

  private handleCancel = () => {
    this.setState({
      isEditMode: false,
      products: mapSubscriptionsToHashMap(
        this.props.data.groupedSubscription.subscriptions
      ),
    })
  }

  private handleRemoveSubscription = () =>
    new Promise(() => console.warn('ihu'))

  private handleOpenRemoveModal = (subscriptionId: string) =>
    this.setState({
      isModalOpen: true,
      selectedSubscription: subscriptionId,
    })

  private handleCloseModal = () =>
    this.setState({
      isModalOpen: false,
      selectedSubscription: '',
    })

  private handleSave = () => {}

  private handleUpdateQuantity = (id: string, quantity: number) => {
    const updatedProducts = {
      ...this.state.products,
      [id]: { ...this.state.products[id], quantity },
    }

    this.setState({ products: updatedProducts })
  }

  private getProductsAvailable = () =>
    Object.values<SubscriptionProduct>(this.state.products).filter(
      p => p.quantity > 0
    )

  public render() {
    const {
      data: { groupedSubscription },
    } = this.props
    const { isEditMode, isLoading, isModalOpen } = this.state

    const products = this.getProductsAvailable()

    return (
      <Fragment>
        <ConfirmationModal
          confirmationLabel="remover"
          cancelationLabel="cancelar"
          errorMessage="erou"
          isModalOpen={isModalOpen}
          onCloseModal={this.handleCloseModal}
          onSubmit={this.handleRemoveSubscription}
          onLoading={this.handleLoading}
        >
          Deseja realmente remover esse produto?
        </ConfirmationModal>
        <Listing
          isEditing={isEditMode}
          isLoading={isLoading}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          onGoToEdition={this.handleGoToEdition}
          onRemoveSubscription={this.handleOpenRemoveModal}
          onUpdateQuantity={this.handleUpdateQuantity}
          subscriptionStatus={groupedSubscription.status}
          products={products}
          currency={groupedSubscription.purchaseSettings.currencySymbol}
        />
      </Fragment>
    )
  }
}

interface State {
  isEditMode: boolean
  isLoading: boolean
  isModalOpen: boolean
  selectedSubscription: string
  products: { [subscriptionId: string]: SubscriptionProduct }
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
