declare module '*/frequencyOptions.gql' {
  import type { DocumentNode } from 'graphql'
  import type { Frequency } from 'vtex.subscriptions-graphql'

  export type Args = {
    planId: string
  }

  export type Result = {
    frequencies: Frequency[]
  }

  const value: DocumentNode
  export default value
}
