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
import {
  MutationRemoveSubscriptionArgs,
  MutationUpdateSubscriptionsArgs,
} from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'

import REMOVE_MUTATION from '../../../graphql/removeSubscription.gql'
import UPDATE_MUTATION from '../../../graphql/updateSubscriptions.gql'
import ConfirmationModal from '../../ConfirmationModal'
import Listing from './Listing'
import { SubscriptionsGroup, Subscription } from '..'
import { logGraphqlError } from '../../../tracking'

function mapSubscriptionsToHashMap(subscriptions: Subscription[]) {
  return subscriptions.reduce(
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
    subscriptionId: '',
    isEditMode: false,
    isLoading: false,
    isModalOpen: false,
    products: {},
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const shouldUpdate =
      props.group.subscriptions.length !== Object.values(state.products).length

    if (!shouldUpdate) return null

    const products = mapSubscriptionsToHashMap(props.group.subscriptions)

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
      products: mapSubscriptionsToHashMap(this.props.group.subscriptions),
    })
  }

  private handleRemoveSubscription = () => {
    const { removeSubscription, group, showToast, intl } = this.props
    const { subscriptionId } = this.state

    const variables = {
      subscriptionsGroupId: group.id,
      subscriptionId,
    }

    return removeSubscription({
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
          instance: 'RemoveSubscription',
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

  private handleSave = () => {
    const { group, updateSubscriptions, showToast, intl } = this.props

    this.setState({ isLoading: true })

    const variables = {
      subscriptionsGroupId: group.id,
      subscriptions: this.getProducts().map((subscription) => ({
        skuId: subscription.sku.id,
        quantity: subscription.quantity,
      })),
    }

    updateSubscriptions({
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
          instance: 'UpdateSubscriptions',
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

  private getProducts = () => Object.values<Subscription>(this.state.products)

  public render() {
    const { group, intl } = this.props
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
          subscriptionStatus={group.status}
          products={products}
          currency={group.purchaseSettings.currencySymbol}
          canRemove={canRemove}
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
  products: { [subscriptionId: string]: Subscription }
}

interface InnerProps extends InjectedIntlProps, InjectedRuntimeContext {
  removeSubscription: (args: {
    variables: MutationRemoveSubscriptionArgs
  }) => Promise<void>
  updateSubscriptions: (args: {
    variables: MutationUpdateSubscriptionsArgs
  }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

interface OuterProps {
  group: SubscriptionsGroup
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withToast,
  graphql(REMOVE_MUTATION, { name: 'removeSubscription' }),
  graphql(UPDATE_MUTATION, { name: 'updateSubscriptions' }),
  withRuntimeContext
)

export default enhance(ProductsContainer)
