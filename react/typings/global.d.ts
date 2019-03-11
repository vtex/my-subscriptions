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
    shippingAddress: Address
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

  interface UpdateAddressMutationArgs {
    variables: UpdateAddressArgs
  }

  interface UpdateAddressArgs {
    orderGroup: string
    addressId: string
  }
  interface GetAddressesQueryArgs {
    orderGroup: string
  }

  interface Address {
    addressId: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    country: string
    postalCode: string
    reference: string
    formattedAddress: string
    additionalComponents: string
    geoCoordinate: number[]
    receiverName: string
    addressType: string
  }
}

export {}
