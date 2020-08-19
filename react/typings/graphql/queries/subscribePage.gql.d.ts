declare module '*/subscribePage.gql' {
  import { DocumentNode } from 'graphql'

  import { Subscription as Subs, Periodicity } from 'vtex.subscriptions-graphql'

  export type Subscription = Pick<
    Subs,
    'id' | 'name' | 'status' | 'nextPurchaseDate' | 'plan'
  > & {
    items: Array<{
      sku: {
        id: string
        name: string
        imageUrl: string
      }
    }>
  }

  export type SubscribableItem = {
    skuId: string
    plans: string[]
  }

  export interface Result {
    subscriptions: Subscription[]
    item: SubscribableItem
    orderForm: {
      orderFormId: string
    }
  }

  export interface Args {
    skuId: string
  }

  const value: DocumentNode
  export default value
}
