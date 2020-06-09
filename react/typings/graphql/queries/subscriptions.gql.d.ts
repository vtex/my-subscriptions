declare module '*/subscriptions.gql' {
  import { DocumentNode } from 'graphql'

  import {
    Subscription as Subs,
    SubscriptionStatus,
    Periodicity,
  } from 'vtex.subscriptions-graphql'

  export type Subscription = Pick<
    Subs,
    'id' | 'name' | 'nextPurchaseDate' | 'lastUpdate' | 'status' | 'plan'
  > & {
    items: Array<{
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
