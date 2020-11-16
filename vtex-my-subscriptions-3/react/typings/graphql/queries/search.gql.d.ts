declare module '*/search.gql' {
  import { DocumentNode } from 'graphql'

  export interface SubscribableItem {
    name: string
    imageUrl: string
    price: number
    skuId: string
    unitMultiplier: number
    measurementUnit: string
    brand: string
    plans: string[]
  }

  export interface Result {
    search: SubscribableItem[]
  }

  export interface Args {
    searchTerm: string
  }

  const value: DocumentNode
  export default value
}
