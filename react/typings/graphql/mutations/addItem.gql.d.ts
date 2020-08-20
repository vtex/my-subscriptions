declare module '*/addItem.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    subscriptionId: string
    item: {
      id: string
      quantity: number
    }
  }

  const value: DocumentNode
  export default value
}
ˆ
