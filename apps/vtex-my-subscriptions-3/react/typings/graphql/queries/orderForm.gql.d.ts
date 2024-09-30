declare module '*/orderForm.gql' {
  import type { DocumentNode } from 'graphql'
  import type { OrderForm } from 'vtex.store-graphql'

  interface Result {
    orderForm: Pick<OrderForm, 'salesChannel'>
  }

  export { Result }

  const value: DocumentNode
  export default value
}
