declare module '*/subscription.gql' {
  import { DocumentNode } from 'graphql'
  import {
    Sku,
    Subscription as Subs,
    SubscriptionStatus,
    SubscriptionOrder,
    SubscriptionOrderStatus,
    PaymentMethod,
    Periodicity,
    QuerySubscriptionArgs as Args,
  } from 'vtex.subscriptions-graphql'

  interface Item {
    id: string
    sku: Sku & {
      variations?: { [key: string]: string } | null
    }
    quantity: number
    currentPrice: number
  }

  type Subscription = Pick<
    Subs,
    | 'id'
    | 'cacheId'
    | 'name'
    | 'isSkipped'
    | 'totals'
    | 'nextPurchaseDate'
    | 'shippingAddress'
    | 'status'
    | 'estimatedDeliveryDate'
    | 'plan'
  > & {
    items: Item[]
    lastOrder: Pick<SubscriptionOrder, 'id' | 'status'>
    purchaseSettings: {
      currencyCode: string
      paymentMethod: PaymentMethod | null
    }
    __typename: string
  }

  interface Result {
    subscription: Subscription
  }

  export { Subscription, Item, Args, Result }

  const value: DocumentNode
  export default value
}
