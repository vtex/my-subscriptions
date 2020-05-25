declare module '*/subscriptionsGroup.gql' {
  import { DocumentNode } from 'graphql'
  import {
    Sku,
    SubscriptionsGroup as Group,
    SubscriptionStatus,
    SubscriptionOrder,
    SubscriptionOrderStatus,
    PaymentMethod,
    Periodicity,
    QuerySubscriptionsGroupArgs as Args,
  } from 'vtex.subscriptions-graphql'

  interface Subscription {
    id: string
    sku: Pick<
      Sku,
      | 'imageUrl'
      | 'name'
      | 'detailUrl'
      | 'productName'
      | 'id'
      | 'measurementUnit'
    > & {
      variations?: { [key: string]: string } | null
    }
    quantity: number
    currentPrice: number
  }

  type SubscriptionsGroup = Pick<
    Group,
    | 'id'
    | 'name'
    | 'isSkipped'
    | 'totals'
    | 'shippingEstimate'
    | 'nextPurchaseDate'
    | 'shippingAddress'
  > & {
    status: SubscriptionStatus
    subscriptions: Subscription[]
    lastOrder: Pick<SubscriptionOrder, 'id'> & {
      status: SubscriptionOrderStatus
    }
    purchaseSettings: {
      currencySymbol: string
      purchaseDay: string | null
      paymentMethod: PaymentMethod | null
    }
    plan: {
      frequency: {
        periodicity: Periodicity
        interval: number
      }
    }
    __typename: string
  }

  interface Result {
    group: SubscriptionsGroup
  }

  export { SubscriptionsGroup, Subscription, Args, Result }

  const value: DocumentNode
  export default value
}
