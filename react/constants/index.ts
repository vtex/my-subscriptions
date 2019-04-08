export enum SubscriptionStatusEnum {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Expired = 'EXPIRED',
  Paused = 'PAUSED',
}

export enum SubscriptionDisplayFilterEnum {
  Active = 'ACTIVE_FILTER',
  Canceled = 'CANCELED_FILTER',
}

export enum TagTypeEnum {
  Error = 'error',
  Warning = 'warning',
}

export enum PaymentGroupEnum {
  BankInvoice = 'bankInvoice',
  PayPal = 'payPal',
  GiftCard = 'giftCard',
  DebitCard = 'debitCard',
  CreditCard = 'creditCard',
}

export enum SubscriptionOrderStatusEnum {
  Triggered = 'TRIGGERED',
  InProcess = 'IN_PROCESS',
  Failure = 'FAILURE',
  Success = 'SUCCESS',
  Expired = 'EXPIRED',
  OrderError = 'ORDER_ERROR',
  PymentError = 'PAYMENT_ERROR',
  Skiped = 'SKIPED',
  SuccessWithNoOrder = 'SUCCESS_WITH_NO_ORDER',
  SuccessWithPartialOrder = 'SUCCESS_WITH_PARTIAL_ORDER',
}

export const WEEK_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export const MONTH_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '16', label: '16' },
  { value: '17', label: '17' },
  { value: '18', label: '18' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28' },
  { value: '29', label: '29' },
  { value: '30', label: '30' },
  { value: '31', label: '31' },
]

export const CSS = {
  subscriptionGroupImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionGroupItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
  cardWrapper:
    'bg-base t-body c-on-base pa5 pa7-ns b--muted-5 bw1 bt bb bl-ns br-ns h-100',
}
