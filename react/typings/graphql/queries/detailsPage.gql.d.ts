declare module '*/detailsPage.gql' {
  import { DocumentNode } from 'graphql'
  import {
    Sku,
    Subscription as Subs,
    SubscriptionExecution,
    PaymentMethod,
    QuerySubscriptionArgs as Args,
    SubscriptionItem,
  } from 'vtex.subscriptions-graphql'

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
    __typename: string
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
