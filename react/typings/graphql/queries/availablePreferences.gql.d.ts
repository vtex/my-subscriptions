declare module '*/availablePreferences.gql' {
  import { DocumentNode } from 'graphql'
  import { PaymentMethod, Frequency, Address } from 'vtex.subscriptions-graphql'

  interface Args {
    subscriptionId: string
  }

  interface Result {
    frequencies: Frequency[]
    addresses: Address[]
    payments: PaymentMethod[]
  }

  export { Args, Result }

  const value: DocumentNode
  export default value
}
