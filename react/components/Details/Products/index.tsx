import React, { Component, Fragment } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import {
  InjectedIntlProps,
  injectIntl,
  defineMessages,
  FormattedMessage,
} from 'react-intl'
import { ApolloError } from 'apollo-client'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import REMOVE_MUTATION, {
  Args as RemoveArgs,
} from '../../../graphql/mutations/removeItem.gql'
import UPDATE_MUTATION, {
  Args as UpdateArgs,
} from '../../../graphql/mutations/updateItems.gql'
import ConfirmationModal from '../../ConfirmationModal'
import Listing from './Listing'
import { Subscription, Item } from '..'
import { logGraphqlError } from '../../../tracking'

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
  editionSuccess: {
    id: 'store/subscription.edit.success',
    defaultMessage: '',
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
      props.subscription.items.length !== Object.values(state.products).length

    if (!shouldUpdate) return null

    const products = mapItemsToHashMap(props.subscription.items)

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
      products: mapItemsToHashMap(this.props.subscription.items),
    })
  }

  private handleRemoveItem = () => {
    const { removeItem, subscription, showToast, intl } = this.props
    const { itemId } = this.state

    const variables = {
      subscriptionId: subscription.id,
      itemId,
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
        logGraphqlError({
          error,
          variables,
          runtime: this.props.runtime,
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
    const { subscription, updateItems, showToast, intl } = this.props

    this.setState({ isLoading: true })

    const variables = {
      subscriptionId: subscription.id,
      items: this.getProducts().map((item) => ({
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
        logGraphqlError({
          error,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'UpdateItems',
        })
      })
      .finally(() => {
        this.setState({ isLoading: false, isEditMode: false })
      })
  }

  private handleUpdateQuantity = (id: string, quantity: number) =>
    this.setState((prevState) => {
      const updatedProducts = {
        ...prevState.products,
        [id]: { ...(prevState.products as State['products'])[id], quantity },
      }
      return { products: updatedProducts }
    })

  private getProducts = () => Object.values<Item>(this.state.products)

  public render() {
    const { subscription, intl } = this.props
    const { isEditMode, isLoading, isModalOpen } = this.state

    const products = this.getProducts()

    const canRemove = products.length > 1

    return (
      <Fragment>
        <ConfirmationModal
          confirmationLabel={intl.formatMessage(messages.confirm)}
          cancelationLabel={intl.formatMessage(messages.cancel)}
          errorMessage={intl.formatMessage(messages.removeError)}
          isModalOpen={isModalOpen}
          onCloseModal={this.handleCloseModal}
          onSubmit={this.handleRemoveItem}
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
          subscriptionStatus={subscription.status}
          products={products}
          currency={subscription.purchaseSettings.currencyCode}
          canRemove={canRemove}
          subscriptionId={subscription.id}
        />
      </Fragment>
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

interface InnerProps extends InjectedIntlProps, InjectedRuntimeContext {
  removeItem: (args: { variables: RemoveArgs }) => Promise<void>
  updateItems: (args: { variables: UpdateArgs }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

interface OuterProps {
  subscription: Subscription
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withToast,
  graphql(REMOVE_MUTATION, { name: 'removeItem' }),
  graphql(UPDATE_MUTATION, { name: 'updateItems' }),
  withRuntimeContext
)

export default enhance(ProductsContainer)
