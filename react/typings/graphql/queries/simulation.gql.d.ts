declare module '*/simulation.gql' {
  import { DocumentNode } from 'graphql'
  import { Periodicity, SimulationResult } from 'vtex.subscriptions-graphql'

  export type SubscriptionForm = {
    nextPurchaseDate: string
    plan: {
      id: string
      frequency: {
        interval: number
        periodicity: Periodicity
      }
    }
    shippingAddress: {
      addressId: string
      addressType: string
    }
    paymentMethod: {
      paymentSystemId: string
      paymentAccountId?: string
    }
    items: Array<{
      skuId: string
      quantity: number
    }>
  }

  export type Args = {
    subscription: SubscriptionForm
  }

  export type Result = {
    simulation: SimulationResult
  }

  const value: DocumentNode
  export default value
}
