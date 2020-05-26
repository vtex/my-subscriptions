declare module '*/retry.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    id: string
    subscriptionOrderId: string
  }

  const value: DocumentNode
  export default value
}
