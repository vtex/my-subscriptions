declare module '*/createSubscription.gql' {
  import type { DocumentNode } from 'graphql'
  import { MutationCreateSubscriptionArgs } from 'vtex.subscriptions-graphql'

  export interface Result {
    createSubscription: {
      id: string
    }
  }

  export { MutationCreateSubscriptionArgs as Args }

  const value: DocumentNode
  export default value
}
ˆ
