declare module '*/frequencyOptions.gql' {
  import { DocumentNode } from 'graphql'
  import { Frequency } from 'vtex.subscriptions-graphql'

  export type Args = {
    planId: string
  }

  export type Result = {
    frequencies: Frequency[]
  }

  const value: DocumentNode
  export default value
}
