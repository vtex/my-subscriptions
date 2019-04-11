import { SubscriptionStatusEnum } from './../enums'

declare global {
  interface SubscriptionsGroupItemType {
    name: string
    orderGroup: string
    status: SubscriptionStatusEnum
    subscriptions: SubscriptionType[]
    nextPurchaseDate: string
    lastStatusUpdate: string
    plan: Plan
    shippingAddress: Address
    lastInstance: SubcriptionOrder
    purchaseSettings: PurchaseSettings
    isSkipped: boolean
    totals: TotalType[]
    shippingEstimate: ShippingEstimateType
  }

  interface ShippingEstimateType {
    estimatedDeliveryDate?: string
  }

  interface TotalType {
    id: string
    value: number
  }

  interface SubscriptionType {
    SubscriptionId: number
    sku: SKUType
    quantity: number
    priceAtSubscriptionDate: number
  }

  interface SKUType {
    SkuId: string
    imageUrl: string
    name: string
    detailUrl: string
    productName: string
  }

  interface Plan {
    frequency: Frequency
    validity: Validity
    type: string
  }

  interface Validity {
    begin: string
    end: string
  }

  interface Frequency {
    periodicity: string
    interval: number
  }

  interface Variables<A> {
    variables: A
  }

  interface UpdateAddressArgs {
    orderGroup: string
    addressId: string
  }

  interface UpdateStatusArgs {
    orderGroup: string
    status: SubscriptionStatusEnum
  }

  interface UpdatePaymentArgs {
    accountId: string | null
    orderGroup: string
    payment: string
  }

  interface UpdateSettingsArgs {
    orderGroup: string
    purchaseDay: string
    periodicity: string
    interval: number
  }

  interface UpdateIsSkippedArgs {
    orderGroup: string
    isSkipped: boolean
  }

  interface RemoveSubscripionArgs {
    itemId: number
    orderGroup: string
  }

  interface RetryArgs {
    orderGroup: string
    instanceId: string
  }

  interface GetAddressesQueryArgs {
    orderGroup: string
  }

  interface AddToCarArgs {
    orderFormId: string
    items: { id: number; quantity: number; seller: string; index: number }[]
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

export {}
