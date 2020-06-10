export enum EditOptions {
  Payment = 'payment',
  Address = 'address',
}

export enum SubscriptionDisplayFilterEnum {
  Active = 'ACTIVE_FILTER',
  Canceled = 'CANCELED_FILTER',
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
  subscriptionImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
  cardTypograph: 't-body bg-base c-on-base',
  cardBorder: 'bw1 bt bb bl-l br-l b--muted-5',
  cardVerticalPadding: 'pv7-l pv5',
  cardHorizontalPadding: 'ph7-l ph5',
}

export const BASIC_CARD_WRAPPER = `h-100 ${CSS.cardBorder} ${CSS.cardTypograph} ${CSS.cardVerticalPadding}`

export const PAYMENT_DIV_ID = 'subscriptions-payment-div'
export const ADDRESS_DIV_ID = 'subscriptions-address-div'
