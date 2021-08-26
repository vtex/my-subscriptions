declare module '*/search.gql' {
  import { DocumentNode } from 'graphql'

  interface SearchItem {
    name: string
    skuId: string
    price: number
    imageUrl: string
    plans: string[]
  }
  export interface SearchProduct {
    unitMultiplier: number
    measurementUnit: string
    brand: string
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
    searchTerm: string
    page: number
    perPage: number
  }

  const value: DocumentNode
  export default value
}
