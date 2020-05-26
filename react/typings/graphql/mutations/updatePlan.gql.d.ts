declare module '*/updatePlan.gql' {
  import { DocumentNode } from 'graphql'
  import { Periodicity } from 'vtex.subscriptions-graphql'

  export interface Args {
    subscriptionId: string
    purchaseDay: string | null
    periodicity: Periodicity
    interval: number
  }

  const value: DocumentNode
  export default value
}
