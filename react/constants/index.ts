// Remove it after fix on typings and we are able to import the enums from the graphql app. by Napoli

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Paused = 'PAUSED',
  Canceled = 'CANCELED',
  Expired = 'EXPIRED',
}

export enum Periodicity {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export enum SubscriptionOrderStatus {
  Triggered = 'TRIGGERED',
  InProcess = 'IN_PROCESS',
  Failure = 'FAILURE',
  Success = 'SUCCESS',
  Expired = 'EXPIRED',
  OrderError = 'ORDER_ERROR',
  PaymentError = 'PAYMENT_ERROR',
  Skiped = 'SKIPED',
  SuccessWithNoOrder = 'SUCCESS_WITH_NO_ORDER',
  SuccessWithPartialOrder = 'SUCCESS_WITH_PARTIAL_ORDER',
  ReTriggered = 'RE_TRIGGERED',
}

export enum PaymentSystemGroup {
  CreditCard = 'creditCard',
  Cash = 'cash',
  BankInvoice = 'bankInvoice',
  GiftCard = 'giftCard',
  PayPal = 'payPal',
}

// /

export enum EditOptions {
  Payment = 'payment',
  Address = 'address',
}

export enum SubscriptionDisplayFilterEnum {
  Active = 'ACTIVE_FILTER',
  Canceled = 'CANCELED_FILTER',
}

export enum TagTypeEnum {
  Error = 'error',
  Warning = 'warning',
}

export enum MenuOptionsEnum {
  Skip = 'skip',
  Unskip = 'unskip',
  Pause = 'pause',
  Cancel = 'cancel',
  Restore = 'restore',
  OrderNow = 'orderNow',
}

export const CSS = {
  subscriptionGroupImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionGroupItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
  cardTypograph: 't-body bg-base c-on-base',
  cardBorder: 'bw1 bt bb bl-l br-l b--muted-5',
  cardVerticalPadding: 'pv7-l pv5',
  cardHorizontalPadding: 'ph7-l ph5',
}

export const BASIC_CARD_WRAPPER = `h-100 ${CSS.cardBorder} ${CSS.cardTypograph} ${CSS.cardVerticalPadding}`

export const PAYMENT_DIV_ID = 'subscriptions-payment-div'
export const ADDRESS_DIV_ID = 'subscriptions-address-div'
