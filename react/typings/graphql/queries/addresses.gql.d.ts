declare module '*/addresses.gql' {
  import { DocumentNode } from 'graphql'
  import { Address } from 'vtex.store-graphql'

  export interface Result {
    profile: {
      addresses: Address[]
    }
  }

  const value: DocumentNode
  export default value
}
