declare module '*/subscriptions.gql' {
  import { DocumentNode } from 'graphql'

  import {
    SubscriptionsGroup as Group,
    SubscriptionStatus,
    Periodicity,
  } from 'vtex.subscriptions-graphql'

  export type SubscriptionsGroup = Pick<
    Group,
    'id' | 'name' | 'nextPurchaseDate' | 'lastStatusUpdate'
  > & {
    status: SubscriptionStatus
    plan: {
      frequency: {
        periodicity: Periodicity
        interval: number
      }
    }
    subscriptions: Array<{
      sku: {
        imageUrl: string
        name: string
        detailUrl: string
        productName: string
      }
    }>
    purchaseSettings: {
      purchaseDay: string
    }
  }
  export interface Result {
    groups: SubscriptionsGroup[]
  }

  const value: DocumentNode
  export default value
}
