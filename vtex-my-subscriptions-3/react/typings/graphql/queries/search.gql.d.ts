declare module '*/search.gql' {
  import { DocumentNode } from 'graphql'

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
    searchProducts: SubscribableItemPaginable
  }

  export interface Args {
    page: number
    perPage: number
  }

  const value: DocumentNode
  export default value
}
