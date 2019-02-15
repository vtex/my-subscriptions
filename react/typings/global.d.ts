import { SubscriptionStatus } from './../enums'

declare global {
  interface SubscriptionsGroupItemType {
    name: string
    orderGroup: string
    status: SubscriptionStatus
    subscriptions: [SubscriptionType]
  }

  interface SubscriptionType {
    sku: SKUType
  }

  interface SKUType {
    imageUrl: string
    nameComplete: string
  }
}

export {}
