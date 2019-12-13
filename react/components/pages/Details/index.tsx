import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { graphql } from 'react-apollo'
import { RouteComponentProps } from 'react-router-dom'
import { withRouter } from 'vtex.my-account-commons/Router'
import {
  MutationRetrySubscriptionOrderArgs,
  SubscriptionsGroup as Group,
  Sku,
  SubscriptionOrder,
  PurchaseSettings,
  SubscriptionStatus,
  SubscriptionOrderStatus,
  Periodicity,
} from 'vtex.subscriptions-graphql'

import SUBSCRIPTIONS_GROUP from '../../../graphql/subscriptionsGroup.gql'
import RETRY_MUTATION from '../../../graphql/retryMutation.gql'
import Name from '../../commons/SubscriptionName'
import { PAYMENT_DIV_ID } from '../../../constants'

import Menu from './Menu'
import History from './History'
import Loader from './Loader'
import Products from './Products'
import Summary from './Summary'

class SubscriptionsGroupDetailsContainer extends Component<Props> {
  public state = {
    displayRetry: false,
    displayAlert: true,
  }

  private mounted = false

  public static getDerivedStateFromProps(props: Props) {
    const lastOrder = props.group && props.group.lastOrder

    return lastOrder &&
      lastOrder.status === SubscriptionOrderStatus.PaymentError
      ? {
          displayRetry: true,
        }
      : null
  }

  public componentDidMount = () => {
    this.mounted = true
  }

  public componentWillUnmount = () => {
    this.mounted = false
  }

  private handleSetDisplayRetry = (displayRetry: boolean) => {
    this.setState({ displayRetry })
  }

  private handleSetDisplayAlert = (displayAlert: boolean) => {
    this.setState({ displayAlert })
  }

  private handleScrollToPayment = () => {
    const paymentDiv = document.getElementById(PAYMENT_DIV_ID)
    paymentDiv && paymentDiv.scrollIntoView()
  }

  private handleMakeRetry = () => {
    const { retry, group } = this.props

    return retry({
      variables: {
        subscriptionsGroupId: (group && group.id) as string,
        subscriptionOrderId: (group &&
          group.lastOrder &&
          group.lastOrder.id) as string,
      },
    }).then(() => {
      this.mounted && this.handleSetDisplayRetry(true)
    })
  }

  private handleUpdateStatus(status: SubscriptionStatus) {}

  public render() {
    const { group } = this.props

    if (!group) return null

    return (
      <div className="w-100 flex flex-wrap c-on-base ph7">
        <div className="w-100 flex flex-wrap justify-between pb7">
          <Name
            skus={group.subscriptions.map(s => s.sku)}
            subscriptionsGroupId={group.id}
            status={group.status}
            isTitle
          />
          <div className="pt4 pt0-l w-100 w-auto-l">
            <Menu group={group} />
          </div>
        </div>
        <div className="w-two-thirds-ns w-100 pr4-ns pb4">
          <NotificationBar group={group} />
        </div>
        <div className="w-third-ns w-100 pl4-ns pb4">
          <Summary group={group} />
        </div>
        <div className="w-two-thirds-ns w-100 pr4-ns pv4">
          <Products group={group} />
        </div>
        <div className="w-third-ns w-100 pl4-ns pt4">
          <History group={group} />
        </div>
      </div>
    )
  }
}

export type SubscriptionsGroup = Pick<
  Group,
  | 'id'
  | 'name'
  | 'isSkipped'
  | 'totals'
  | 'shippingEstimate'
  | 'nextPurchaseDate'
  | 'shippingAddress'
  | 'status'
> & {
  subscriptions: Subscription[]
  lastOrder: Pick<SubscriptionOrder, 'id' | 'status'> | null
  purchaseSettings: Pick<
    PurchaseSettings,
    'currencySymbol' | 'purchaseDay' | 'paymentMethod'
  >
  plan: {
    frequency: {
      periodicity: Periodicity
      interval: number
    }
  }
  __typename: string
}

export interface Subscription {
  id: string
  sku: Pick<
    Sku,
    'imageUrl' | 'name' | 'detailUrl' | 'productName' | 'id' | 'measurementUnit'
  > & {
    variations?: { [key: string]: string } | null
  }
  quantity: number
  priceAtSubscriptionDate: number
}

interface Props extends ChildProps {
  retry: (args: {
    variables: MutationRetrySubscriptionOrderArgs
  }) => Promise<void>
}

interface Response {
  group: SubscriptionsGroup
}
interface Variables {
  id: string
}

type InputProps = RouteComponentProps<{ subscriptionsGroupId: string }>

interface ChildProps {
  loading: boolean
  group?: SubscriptionsGroup
}

const enhance = compose<Props, {}>(
  withRouter,
  graphql(RETRY_MUTATION, { name: 'retry' }),
  graphql<InputProps, Response, Variables, ChildProps>(SUBSCRIPTIONS_GROUP, {
    options: input => ({
      variables: {
        id: input.match.params.subscriptionsGroupId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      group: data && data.group,
    }),
  }),
  branch<ChildProps>(props => props.loading, renderComponent(Loader))
)

export default enhance(SubscriptionsGroupDetailsContainer)
