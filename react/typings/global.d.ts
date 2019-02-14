interface SubscriptionsGroupItemType {
  name: string
  orderGroup: string
  status: string
  subscriptions: [SubscriptionType]
}

interface SubscriptionType {
  sku: SKUType
}

interface SKUType {
  imageUrl: string
  nameComplete: string
}