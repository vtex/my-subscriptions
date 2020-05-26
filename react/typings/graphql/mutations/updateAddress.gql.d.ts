declare module '*/updateAddress.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    subscriptionId: string
    addressId: string
    addressType: string
  }

  const value: DocumentNode
  export default value
}
