import React, { Component, Fragment } from 'react'
import { compose, branch, renderNothing } from 'recompose'
import { graphql } from 'react-apollo'
import {
  InjectedIntlProps,
  injectIntl,
  defineMessages,
  FormattedMessage,
} from 'react-intl'
import { withToast } from 'vtex.styleguide'

import LIST_QUERY from '../../../../graphql/products/listSubscriptions.gql'
import REMOVE_MUTATION from '../../../../graphql/products/removeSubscription.gql'
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

const messages = defineMessages({
  removeSuccess: {
    id: 'store/subscription.products.card.remove.success',
    defaultMessage: '',
  },
  removeError: {
    id: 'store/subscription.products.card.remove.error',
    defaultMessage: '',
  },
  cancel: {
    id: 'store/subscription.edition.button.cancel',
    defaultMessage: '',
  },
  confirm: {
    id: 'store/subscription.products.card.remove.confirm',
    defaultMessage: '',
  },
})

class ProductsContainer extends Component<InnerProps & OutterProps, State> {
  public constructor(props: InnerProps & OutterProps) {
    super(props)

    const products = mapSubscriptionsToHashMap(
      props.data.groupedSubscription.subscriptions
    )

    this.state = {
      subscriptionId: '',
      isEditMode: false,
      isLoading: false,
      isModalOpen: false,
      products,
    }
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

  private handleRemoveSubscription = () => {
    const { removeSubscription, orderGroup, showToast, intl } = this.props
    const { subscriptionId } = this.state

    return removeSubscription({
      variables: {
        subscriptionsGroupId: orderGroup,
        subscriptionId,
      },
    }).then(() => {
      this.setState({
        isModalOpen: false,
      })
      showToast({
        message: intl.formatMessage(messages.removeSuccess),
      })
    })
  }

  private handleOpenRemoveModal = (subscriptionId: string) =>
    this.setState({
      isModalOpen: true,
      subscriptionId,
    })

  private handleCloseModal = () =>
    this.setState({
      isModalOpen: false,
      subscriptionId: '',
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
      intl,
    } = this.props
    const { isEditMode, isLoading, isModalOpen } = this.state

    const products = this.getProductsAvailable()

    return (
      <Fragment>
        <ConfirmationModal
          confirmationLabel={intl.formatMessage(messages.confirm)}
          cancelationLabel={intl.formatMessage(messages.cancel)}
          errorMessage={intl.formatMessage(messages.removeError)}
          isModalOpen={isModalOpen}
          onCloseModal={this.handleCloseModal}
          onSubmit={this.handleRemoveSubscription}
        >
          <h4 className="t-heading-4">
            <FormattedMessage id="store/subscription.products.card.remove.title" />
          </h4>
          <p className="t-body">
            <FormattedMessage id="store/subscription.products.card.remove.desc" />
          </p>
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
  subscriptionId: string
  products: { [subscriptionId: string]: SubscriptionProduct }
}

interface InnerProps extends InjectedIntlProps {
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
  removeSubscription: (args: Variables<RemoveSubscripionArgs>) => Promise<void>
  showToast: (args: { message: string }) => void
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
  graphql(LIST_QUERY),
  branch<InnerProps>(({ data: { loading } }) => loading, renderNothing),
  graphql(REMOVE_MUTATION, { name: 'removeSubscription' }),
  withToast,
  injectIntl
)

export default enhance(ProductsContainer)
