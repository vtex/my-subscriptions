declare module '*/paymentMethods.gql' {
  import { DocumentNode } from 'graphql'
  import { PaymentMethod } from 'vtex.subscriptions-graphql'

  export interface Result {
    methods: PaymentMethod[]
  }

  const value: DocumentNode
  export default value
}
