import { SubscriptionStatus } from './../enums'

declare global {
  interface SubscriptionsGroupItemType {
    name: string
    orderGroup: string
    status: SubscriptionStatus
    subscriptions: [SubscriptionType]
    nextPurchaseDate: string
    lastStatusUpdate: string
    plan: SubscriptionPlanType
  }

  interface SubscriptionType {
    sku: SKUType
  }

  interface SKUType {
    imageUrl: string
    name: string
    detailUrl: string
    productName: string
  }

  interface SubscriptionPlanType {
    frequency: SubscriptionFrequencyType
  }

  interface SubscriptionFrequencyType {
    periodicity: string
    interval: number
  }
}

export {}
