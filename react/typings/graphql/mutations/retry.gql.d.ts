declare module '*/retry.gql' {
  import { DocumentNode } from 'graphql'
  import { MutationRetryArgs as Args } from 'vtex.subscriptions-graphql'

  export { Args }

  const value: DocumentNode
  export default value
}
