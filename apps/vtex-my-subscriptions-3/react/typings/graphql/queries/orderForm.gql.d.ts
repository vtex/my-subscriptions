declare module '*/orderForm.gql' {
  import { DocumentNode } from 'graphql'
  import { OrderForm } from 'vtex.store-graphql'

  interface Result {
    orderForm: Pick<OrderForm, 'salesChannel'>
  }

  export { Result }

  const value: DocumentNode
  export default value
}
