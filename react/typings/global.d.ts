import { SubscriptionStatus } from './../enums'

declare global {
  interface SubscriptionsGroupItemType {
    name: string
    orderGroup: string
    status: SubscriptionStatus
    subscriptions: [SubscriptionType]
    nextPurchaseDate: string
    lastStatusUpdate: string
    plan: Plan
    shippingAddress: Address
    lastInstance: SubcriptionOrder
    purchaseSettings: PurchaseSettings
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

  interface Plan {
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

  interface MutationArgs<A> {
    variables: A
  }

  interface UpdatePaymentArgs {
    accountId: string | null
    orderGroup: string
    payment: string
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

  interface SubcriptionOrder {
    status: SubscriptionOrderStatusEnum
    orderGroup: string
    date: string
    dataInstanceId: string
    workflowId: string
    customerName: string
    customerEmail: string
    message: string
    context: Context
  }

  interface Context {
    items: ContextItem[]
    plan: Plan
    value: number
    paymentSystemName: string
  }

  interface ContextItem {
    skuId: string
    name: string
    imageUrl: string
    quantity: number
    price: number
    isGift: boolean
  }

  interface PurchaseSettings {
    purchaseDay: string
    paymentMethod: PaymentMethod
    seller: string
    salesChannel: string
    currencySymbol: string
    cycleCount: number
  }

  interface PaymentMethod {
    paymentSystem: string
    paymentSystemName: string
    paymentSystemGroup: string
    paymentAccount: PaymentAccount
  }

  interface PaymentAccount {
    accountId: string
    paymentSystem: string
    paymentSystemName: string
    cardNumber: string
    bin: string
  }

  interface ShowToastArgs {
    message: string
  }
}

