declare module '*/simulation.gql' {
  import type { DocumentNode } from 'graphql'
  import type { SimulationResult } from 'vtex.subscriptions-graphql'
  import {
    Periodicity,
    SubscriptionFormInput,
  } from 'vtex.subscriptions-graphql'

  export type Args = {
    subscription: SubscriptionFormInput
  }

  export type Result = {
    simulation: SimulationResult
  }

  export { SubscriptionFormInput as SubscriptionForm }

  const value: DocumentNode
  export default value
}
