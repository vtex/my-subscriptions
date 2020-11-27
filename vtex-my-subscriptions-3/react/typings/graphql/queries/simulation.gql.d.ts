declare module '*/simulation.gql' {
  import { DocumentNode } from 'graphql'
  import {
    Periodicity,
    SimulationResult,
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
