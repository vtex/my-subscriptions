declare module '*/detailsPage.gql' {
  import type { DocumentNode } from 'graphql'
  import type {
    Subscription as Subs,
    SubscriptionExecution,
    PaymentMethod,
    SubscriptionItem,
  } from 'vtex.subscriptions-graphql'
  import { QuerySubscriptionArgs as Args } from 'vtex.subscriptions-graphql'

  type Item = Pick<SubscriptionItem, 'id' | 'currentPrice' | 'quantity' | 'sku'>

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
    | 'addressId'
    | 'paymentAccountId'
  > & {
    items: Item[]
    lastExecution: Pick<SubscriptionExecution, 'id' | 'status'> | null
    purchaseSettings: {
      currencyCode: string
      paymentMethod: PaymentMethod | null
    }
  }

  interface Result {
    subscription: Subscription
    orderForm: {
      orderFormId: string
    }
  }

  export { Subscription, Item, Args, Result }

  const value: DocumentNode
  export default value
}
