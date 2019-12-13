export enum SubscriptionState {
  NextDelivery = 'NEXT_DELIVERY',
  InvalidPayment = 'INVALID_PAYMENT',
  InvalidAddress = 'INVALID_ADDRESS',
  Paused = 'PAUSED',
  Skipped = 'SKIPPED',
  PaymentError = 'PAYMENT_ERROR',
  Canceled = 'CANCELED',
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
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
]

export const CSS = {
  subscriptionGroupImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionGroupItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
  cardTypograph: 't-body bg-base c-on-base',
  cardBorder: 'bw1 bt bb bl-l br-l b--muted-5',
  cardVerticalPadding: 'pv7-l pv5',
  cardHorizontalPadding: 'ph6-l ph5',
  cardTitle: 't-heading-4 mb7',
}

export const PAYMENT_DIV_ID = 'subscriptions-payment-div'
