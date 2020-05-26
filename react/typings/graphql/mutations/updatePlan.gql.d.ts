declare module '*/updatePlan.gql' {
  import { DocumentNode } from 'graphql'
  import { Periodicity } from 'vtex.subscriptions-graphql'

  export interface Args {
    id: string
    purchaseDay?: string
    periodicity: Periodicity
    interval: number
  }

  const value: DocumentNode
  export default value
}
