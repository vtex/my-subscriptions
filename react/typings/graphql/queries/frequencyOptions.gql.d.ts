declare module '*/frequencyOptions.gql' {
  import { DocumentNode } from 'graphql'

  interface Args {
    subscriptionId: string
  }

  interface Result {
    frequencies: Frequency[]
  }

  export { Args, Result }

  const value: DocumentNode
  export default value
}
