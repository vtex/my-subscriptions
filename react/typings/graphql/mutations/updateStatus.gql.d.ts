declare module '*/updateStatus.gql' {
  import { DocumentNode } from 'graphql'
  import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

  export interface Args {
    id: string
    status: SubscriptionStatus
  }

  const value: DocumentNode
  export default value
}
