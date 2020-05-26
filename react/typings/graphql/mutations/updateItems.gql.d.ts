declare module '*/updateItems.gql' {
  import { DocumentNode } from 'graphql'
  import { ItemInput } from 'vtex.subscriptions-graphql'

  export interface Args {
    subscriptionId: string
    items: ItemInput[]
  }

  const value: DocumentNode
  export default value
}
