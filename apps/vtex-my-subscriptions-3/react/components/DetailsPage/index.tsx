import type { ErrorInfo } from 'react'
import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import type { MutationResult } from 'react-apollo'
import { graphql } from 'react-apollo'
import type { ApolloError } from 'apollo-client'
import type { RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRouter } from 'vtex.my-account-commons/Router'
import type { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import type {
  Subscription,
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/detailsPage.gql'
import DETAILS_PAGE_QUERY from '../../graphql/queries/detailsPage.gql'
import type { Args as AddItemArgs } from '../../graphql/mutations/orderNow.gql'
import ORDER_NOW from '../../graphql/mutations/orderNow.gql'
import type { Args as UpdateStatusArgs } from '../../graphql/mutations/updateStatus.gql'
import UPDATE_STATUS from '../../graphql/mutations/updateStatus.gql'
import type { Args as UpdateIsSkippedArgs } from '../../graphql/mutations/updateIsSkipped.gql'
import UPDATE_IS_SKIPPED from '../../graphql/mutations/updateIsSkipped.gql'
import {
  logError,
  withQueryWrapper,
  logGraphQLError,
  getRuntimeInfo,
} from '../../tracking'
import Header from './PageHeader'
import type { SubscriptionAction } from './utils'
import { retrieveModalConfig, goToElement } from './utils'
import ConfirmationModal from '../ConfirmationModal'
import ActionBar from './ActionBar'
import Products from './Products'
import Preferences from './Preferences'
import Summary from '../Summary'
import History from './History'
import Skeleton from './Skeleton'

const INSTANCE = 'SubscriptionsDetails'
const PREFERENCES_ID = 'vtex.subscription.preferences.div'
const DETAILS_ID = 'vtex.subscription.details.div'

const messages = defineMessages({
  errorMessage: {
    id: 'subscription.fallback.error.message',
  },
})

class SubscriptionsDetailsContainer extends Component<Props, State> {
  public state = {
    isModalOpen: false,
    errorMessage: null,
    actionType: null,
    displayHistory: false,
    isEditMode: false,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error: {
        ...error,
        ...errorInfo,
      },
      runtimeInfo: getRuntimeInfo(),
      instance: INSTANCE,
    })
  }

  public componentDidMount() {
    document.body.scrollIntoView(true)
  }

  private handleOpenHistory = () => this.setState({ displayHistory: true })

  private handleCloseHistory = () => this.setState({ displayHistory: false })

  private handleChangeEdit = (isEditMode: boolean) =>
    this.setState({ isEditMode })

  private handleUpdateStatus = (status: SubscriptionStatus) => {
    const { updateStatus, subscription } = this.props

    if (!subscription) return null

    const variables = {
      status,
      subscriptionId: subscription.id,
    }

    return updateStatus({
      variables,
    }).catch((error: ApolloError) => {
      logGraphQLError({
        error,
        variables,
        runtimeInfo: getRuntimeInfo(),
        type: 'MutationError',
        instance: 'UpdateStatus',
      })
      throw error
    })
  }

  private handleUpdateAction = (action: SubscriptionAction) => {
    if (action === 'changeAddress' || action === 'changePayment') {
      this.setState({ isEditMode: true })
      goToElement({ id: PREFERENCES_ID })
    } else {
      this.setState({ isModalOpen: true, actionType: action })
    }
  }

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleError = () =>
    this.setState({
      errorMessage: this.props.intl.formatMessage(messages.errorMessage),
    })

  private handleUpdateSkipped = () => {
    const { updateIsSkipped, subscription } = this.props

    if (!subscription) return null

    const variables = {
      subscriptionId: subscription.id,
      isSkipped: !subscription.isSkipped,
    }

    return updateIsSkipped({
      variables,
    }).catch((error: ApolloError) => {
      logGraphQLError({
        error,
        variables,
        runtimeInfo: getRuntimeInfo(),
        type: 'MutationError',
        instance: 'UpdateIsSkipped',
      })
      throw error
    })
  }

  private handleOrderNow = () => {
    const { orderFormId, orderNow, subscription } = this.props

    if (!subscription) return null

    const items = subscription.items.map(item => ({
      quantity: item.quantity,
      id: parseInt(item.sku.id, 10),
      seller: '1',
    }))

    const variables = {
      orderFormId,
      items,
    }

    return orderNow({ variables })
      .then(() => (window.location.href = '/checkout/'))
      .catch((error: ApolloError) => {
        logGraphQLError({
          error,
          variables,
          runtimeInfo: getRuntimeInfo(),
          type: 'MutationError',
          instance: 'OrderNow',
        })
        throw error
      })
  }

  public render() {
    const { subscription, orderFormId, intl } = this.props
    const {
      actionType,
      isModalOpen,
      errorMessage,
      displayHistory,
      isEditMode,
    } = this.state

    if (!subscription) return null

    const modalProps = retrieveModalConfig({
      orderNow: this.handleOrderNow,
      onCloseModal: this.handleCloseModal,
      onError: this.handleError,
      updateSkip: this.handleUpdateSkipped,
      updateStatus: this.handleUpdateStatus,
      intl,
      action: actionType,
      isModalOpen,
      errorMessage,
    })

    return (
      <div id={DETAILS_ID}>
        <History
          subscriptionId={subscription.id}
          isOpen={displayHistory}
          onClose={this.handleCloseHistory}
        />
        <ConfirmationModal {...modalProps} />
        <Header
          name={subscription.name}
          status={subscription.status}
          subscriptionId={subscription.id}
          orderFormId={orderFormId}
          skus={subscription.items.map(item => ({
            detailUrl: item.sku.detailUrl,
            name: item.sku.name,
          }))}
          isSkipped={subscription.isSkipped}
          onUpdateAction={this.handleUpdateAction}
          onOpenHistory={this.handleOpenHistory}
        />
        <div className="pa5 pa7-ns flex flex-wrap">
          <div className="w-100 w-60-ns">
            <ActionBar
              status={subscription.status}
              isSkipped={subscription.isSkipped}
              address={subscription.shippingAddress}
              payment={subscription.purchaseSettings.paymentMethod}
              onUpdateAction={this.handleUpdateAction}
              nextPurchaseDate={subscription.nextPurchaseDate}
            />
            <Products
              subscriptionId={subscription.id}
              status={subscription.status}
              items={subscription.items}
              planId={subscription.plan.id}
              currencyCode={subscription.purchaseSettings.currencyCode}
            />
          </div>
          <div
            className="w-100 w-40-ns pt6 pt0-ns pl0 pl6-ns"
            id={PREFERENCES_ID}
          >
            <Preferences
              isEditMode={isEditMode}
              onChangeEdit={this.handleChangeEdit}
              status={subscription.status}
              plan={subscription.plan}
              payment={subscription.purchaseSettings}
              currentPaymentAccountId={subscription.paymentAccountId ?? null}
              address={subscription.shippingAddress}
              currentAddressId={subscription.addressId ?? null}
              subscriptionId={subscription.id}
              lastExecutionStatus={subscription.lastExecution?.status}
            />
            <Summary
              totals={subscription.totals}
              currencyCode={subscription.purchaseSettings.currencyCode}
            />
          </div>
        </div>
      </div>
    )
  }
}

interface Variables<T> {
  variables: T
}

type State = {
  isModalOpen: boolean
  displayHistory: boolean
  errorMessage: string | null
  actionType: SubscriptionAction | null
  isEditMode: boolean
}

type Props = {
  orderNow: (args: Variables<AddItemArgs>) => Promise<MutationResult>
  updateIsSkipped: (
    args: Variables<UpdateIsSkippedArgs>
  ) => Promise<MutationResult>
  updateStatus: (args: Variables<UpdateStatusArgs>) => Promise<MutationResult>
} & WrappedComponentProps &
  ChildProps

type InputProps = RouteComponentProps<{ subscriptionId: string }>

interface ChildProps {
  loading: boolean
  subscription?: Subscription
  orderFormId?: string
}

const enhance = compose<Props, Record<string, unknown>>(
  injectIntl,
  withRouter,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ORDER_NOW, { name: 'orderNow' }),
  withQueryWrapper<InputProps, Result, QueryArgs, ChildProps>({
    workflowInstance: INSTANCE,
    document: DETAILS_PAGE_QUERY,
    getRuntimeInfo,
    operationOptions: {
      options: input => ({
        variables: {
          id: input.match.params.subscriptionId,
        },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        subscription: data?.subscription,
        orderFormId: data?.orderForm?.orderFormId,
      }),
    },
  }),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(SubscriptionsDetailsContainer)
