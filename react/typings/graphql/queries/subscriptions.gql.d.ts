declare module '*/subscriptions.gql' {
  import { DocumentNode } from 'graphql'

  import {
    SubscriptionsGroup as Group,
    SubscriptionStatus,
    Periodicity,
  } from 'vtex.subscriptions-graphql'

  export type Subscription = Pick<
    Group,
    'id' | 'name' | 'nextPurchaseDate' | 'lastUpdate' | 'status' | 'plan'
  > & {
    subscriptions: Array<{
      sku: {
        imageUrl: string
        name: string
        detailUrl: string
        productName: string
      }
    }>
  }

  export interface Result {
    list: Subscription[]
  }

  const value: DocumentNode
  export default value
}
