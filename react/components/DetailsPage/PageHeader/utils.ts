import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

export type MenuOption =
  | 'skip'
  | 'unskip'
  | 'pause'
  | 'cancel'
  | 'restore'
  | 'orderNow'

export function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus,
  orderFormId: string | undefined
): MenuOption[] {
  const options: MenuOption[] = isSkipped
    ? ['unskip', 'pause', 'cancel']
    : status === 'PAUSED'
    ? ['restore', 'cancel']
    : ['skip', 'pause', 'cancel']

  if (orderFormId) {
    options.push('orderNow')
  }

  return options
}
