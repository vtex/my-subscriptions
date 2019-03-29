export enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
}

export enum SubscriptionDisplayFilterEnum {
  ACTIVE = 'ACTIVE_FILTER',
  CANCELED = 'CANCELED_FILTER',
}

export enum TagTypeEnum {
  ERROR = 'error',
  WARNING = 'warning',
}

export enum PaymentGroupEnum {
  BANK_INVOICE = 'bankInvoice',
  PAY_PAL = 'payPal',
  GIFT_CARD = 'giftCard',
  DEBIT_CARD = 'debitCard',
  CREDIT_CARD = 'creditCard',
}

export enum SubscriptionOrderStatusEnum {
  TRIGGERED = 'TRIGGERED',
  IN_PROCESS = 'IN_PROCESS',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
  EXPIRED = 'EXPIRED',
  ORDER_ERROR = 'ORDER_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  SKIPED = 'SKIPED',
  SUCCESS_WITH_NO_ORDER = 'SUCCESS_WITH_NO_ORDER',
  SUCCESS_WITH_PARTIAL_ORDER = 'SUCCESS_WITH_PARTIAL_ORDER',
}
