declare module '*/updateAddress.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    id: string
    addressId: string
    addressType: string
  }

  const value: DocumentNode
  export default value
}
