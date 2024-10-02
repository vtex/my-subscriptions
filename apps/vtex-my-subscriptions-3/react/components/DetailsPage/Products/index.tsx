import React, { Component } from 'react'
import { compose } from 'recompose'
import type { MutationResult } from 'react-apollo'
import { graphql } from 'react-apollo'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import type { ApolloError } from 'apollo-client'
import type { ShowToastArgs } from 'vtex.styleguide'
import { withToast } from 'vtex.styleguide'
import type { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import type { Item } from '../../../graphql/queries/detailsPage.gql'
import type { Args as RemoveArgs } from '../../../graphql/mutations/removeItem.gql'
import REMOVE_MUTATION from '../../../graphql/mutations/removeItem.gql'
import type { Args as UpdateArgs } from '../../../graphql/mutations/updateItems.gql'
import UPDATE_MUTATION from '../../../graphql/mutations/updateItems.gql'
import type {
  Args as AddArgs,
  Result as AddResult,
} from '../../../graphql/mutations/addItem.gql'
import ADD_ITEM_MUTATION from '../../../graphql/mutations/addItem.gql'
import ConfirmationModal from '../../ConfirmationModal'
import Listing from './Listing'
import { logGraphQLError, getRuntimeInfo } from '../../../tracking'
import type { OnAddItemArgs } from '../../AddItemModal'

function mapItemsToHashMap(items: Item[]) {
  return items.reduce(
    (previous, current) => ({
      ...previous,
      [current.id]: current,
    }),
    {}
  )
}

const messages = defineMessages({
  removeSuccess: {
    id: 'subscription.products.card.remove.success',
  },
  removeError: {
    id: 'subscription.products.card.remove.error',
  },
  cancel: {
    id: 'subscription.edition.button.cancel',
  },
  confirm: {
    id: 'subscription.products.card.remove.confirm',
  },
  editionSuccess: {
    id: 'subscription.edit.success',
  },
  success: {
    id: 'add-item.success',
  },
  undo: {
    id: 'subscription.products.undo',
  },
})

class ProductsContainer extends Component<Props, State> {
  public state = {
    itemId: '',
    isEditMode: false,
    isLoading: false,
    isModalOpen: false,
    products: {},
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const shouldUpdate =
      props.items.length !== Object.values(state.products).length

    if (!shouldUpdate) return null

    const products = mapItemsToHashMap(props.items)

    return {
      products,
    }
  }

  private handleGoToEdition = () => {
    this.setState({ isEditMode: true })
  }

  private handleCancel = () => {
    this.setState({
      isEditMode: false,
      products: mapItemsToHashMap(this.props.items),
    })
  }

  private handleRemoveItem = (itemId?: string) => {
    const { removeItem, showToast, intl, subscriptionId } = this.props

    const variables = {
      subscriptionId,
      itemId: itemId ?? this.state.itemId,
    }

    return removeItem({
      variables,
    })
      .then(() => {
        this.setState({
          isModalOpen: false,
        })
        showToast({
          message: intl.formatMessage(messages.removeSuccess),
        })
      })
      .catch((error: ApolloError) => {
        logGraphQLError({
          error,
          variables,
          runtimeInfo: getRuntimeInfo(),
          type: 'MutationError',
          instance: 'RemoveItem',
        })
      })
  }

  private handleOpenRemoveModal = (itemId: string) =>
    this.setState({
      isModalOpen: true,
      itemId,
    })

  private handleCloseModal = () =>
    this.setState({
      isModalOpen: false,
      itemId: '',
    })

  private handleSave = () => {
    const { subscriptionId, updateItems, showToast, intl } = this.props

    this.setState({ isLoading: true })

    const variables = {
      subscriptionId,
      items: this.getProducts().map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }

    updateItems({
      variables,
    })
      .then(() =>
        showToast({ message: intl.formatMessage(messages.editionSuccess) })
      )
      .catch((error: ApolloError) => {
        logGraphQLError({
          error,
          variables,
          runtimeInfo: getRuntimeInfo(),
          type: 'MutationError',
          instance: 'UpdateItems',
        })
      })
      .finally(() => {
        this.setState({ isLoading: false, isEditMode: false })
      })
  }

  private handleUpdateQuantity = (id: string, quantity: number) =>
    this.setState(prevState => {
      const updatedProducts = {
        ...prevState.products,
        [id]: { ...(prevState.products as State['products'])[id], quantity },
      }

      return { products: updatedProducts }
    })

  private getProducts = () => Object.values<Item>(this.state.products)

  private handleAddItem = ({
    skuId,
    quantity,
    onError,
    onFinish,
  }: OnAddItemArgs) => {
    const { subscriptionId, showToast, addItem, intl } = this.props

    const variables = {
      item: { id: skuId, quantity },
      subscriptionId,
    }

    addItem({
      variables,
    })
      .then(({ data }) => {
        if (!data) return

        const item = data.addItem.items.find(
          subsItem => subsItem.sku.id === skuId
        )

        if (!item) return

        showToast({
          message: intl.formatMessage(messages.success),
          ...(item
            ? {
                action: {
                  label: intl.formatMessage(messages.undo),
                  onClick: () => this.handleRemoveItem(item.id),
                },
              }
            : {}),
        })
      })
      .catch((error: ApolloError) => {
        logGraphQLError({
          error,
          variables,
          runtimeInfo: getRuntimeInfo(),
          type: 'MutationError',
          instance: 'SubscriptionsDetails/AddItem',
        })
        onError()
      })
      .finally(() => onFinish())
  }

  public render() {
    const { intl, status, planId, currencyCode } = this.props
    const { isEditMode, isLoading, isModalOpen } = this.state

    const products = this.getProducts()

    const canRemove = products.length > 1

    return (
      <>
        <ConfirmationModal
          confirmationLabel={intl.formatMessage(messages.confirm)}
          cancelationLabel={intl.formatMessage(messages.cancel)}
          errorMessage={intl.formatMessage(messages.removeError)}
          isModalOpen={isModalOpen}
          onCloseModal={this.handleCloseModal}
          onSubmit={this.handleRemoveItem}
        >
          <h4 className="t-heading-4">
            <FormattedMessage id="subscription.products.card.remove.title" />
          </h4>
          <p className="t-body">
            <FormattedMessage id="subscription.products.card.remove.desc" />
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
          status={status}
          products={products}
          currency={currencyCode}
          canRemove={canRemove}
          currentPlan={planId}
          onAddItem={this.handleAddItem}
        />
      </>
    )
  }
}

interface State {
  isEditMode: boolean
  isLoading: boolean
  isModalOpen: boolean
  itemId: string
  products: { [itemId: string]: Item }
}

interface InnerProps extends WrappedComponentProps {
  removeItem: (args: { variables: RemoveArgs }) => Promise<void>
  updateItems: (args: { variables: UpdateArgs }) => Promise<void>
  addItem: (args: { variables: AddArgs }) => Promise<MutationResult<AddResult>>
  showToast: (args: ShowToastArgs) => void
}

interface OuterProps {
  subscriptionId: string
  items: Item[]
  planId: string
  currencyCode: string
  status: SubscriptionStatus
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withToast,
  graphql(REMOVE_MUTATION, { name: 'removeItem' }),
  graphql(UPDATE_MUTATION, { name: 'updateItems' }),
  graphql(ADD_ITEM_MUTATION, {
    name: 'addItem',
  })
)

export default enhance(ProductsContainer)
