declare module '*/updateItems.gql' {
  import { DocumentNode } from 'graphql'
  import { ItemInput } from 'vtex.subscriptions-graphql'

  export interface Args {
    id: string
    items: ItemInput[] // TODO fix typing
  }

  const value: DocumentNode
  export default value
}
