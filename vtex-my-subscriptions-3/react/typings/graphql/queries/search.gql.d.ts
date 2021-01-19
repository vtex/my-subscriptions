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

  interface SearchItem {
    skuId: string
    imageUrl: string
    variations: string[]
    plans: string[]
  }
  export interface SearchProduct {
    productId: string
    productName: string
    unitMultiplier: number
    measurementUnit: string
    brand: string
    price: number
    categories: string[]
    items: SearchItem[]
  }

  export interface SubscribableItemPaginable {
    list: SearchProduct[]
    totalCount: number
  }

  export interface Result {
    search: SubscribableItem[]
    searchProducts: SubscribableItemPaginable
  }

  export interface Args {
    subscriptionId: string
    page: number
    perPage: number
  }

  const value: DocumentNode
  export default value
}
