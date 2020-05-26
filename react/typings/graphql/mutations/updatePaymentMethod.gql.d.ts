declare module '*/updatePaymentMethod.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    id: string
    paymentSystemId: string
    paymentAccountId?: string
  }

  const value: DocumentNode
  export default value
}
