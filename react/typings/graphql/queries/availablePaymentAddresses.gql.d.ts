declare module '*/availablePaymentAddresses.gql' {
  import { DocumentNode } from 'graphql'
  import { PaymentMethod, Address } from 'vtex.subscriptions-graphql'

  interface Result {
    addresses: Address[]
    payments: PaymentMethod[]
  }

  export { Result }

  const value: DocumentNode
  export default value
}
