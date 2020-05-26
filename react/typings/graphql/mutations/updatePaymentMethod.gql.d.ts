declare module '*/updatePaymentMethod.gql' {
  import { DocumentNode } from 'graphql'

  export interface Args {
    subscriptionId: string
    paymentSystemId: string
    paymentAccountId: string | null
  }

  const value: DocumentNode
  export default value
}
