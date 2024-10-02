declare module '*/availablePaymentAddresses.gql' {
  import type { DocumentNode } from 'graphql'
  import type { PaymentMethod, Address } from 'vtex.subscriptions-graphql'

  interface Result {
    addresses: Address[]
    payments: PaymentMethod[]
  }

  export { Result }

  const value: DocumentNode
  export default value
}
