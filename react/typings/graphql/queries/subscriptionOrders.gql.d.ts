declare module '*/subscriptionOrders.gql' {
  import { DocumentNode } from 'graphql'
  import { SubscriptionOrderStatus } from 'vtex.subscriptions-graphql'

  interface SubscriptionOrder {
    id: string
    status: SubscriptionOrderStatus
    date: string
  }

  interface Result {
    orders: { list: SubscriptionOrder[]; totalCount: number }
  }

  interface Args {
    subscriptionId: string
    page: number
    perPage: number
  }

  export { SubscriptionOrder, Result, Args }

  const value: DocumentNode
  export default value
}
