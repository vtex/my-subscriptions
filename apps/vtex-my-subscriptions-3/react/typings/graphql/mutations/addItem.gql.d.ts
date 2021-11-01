declare module '*/addItem.gql' {
  import { DocumentNode } from 'graphql'
  import { SubscriptionItem } from 'vtex.subscriptions-graphql'

  export interface Args {
    subscriptionId: string
    item: {
      id: string
      quantity: number
    }
  }

  export interface Result {
    addItem: {
      totals: {
        id: string
        value: string
      }
      items: Array<
        Pick<SubscriptionItem, 'id' | 'quantity' | 'sku' | 'currentPrice'>
      >
    }
  }

  const value: DocumentNode
  export default value
}
ˆ
