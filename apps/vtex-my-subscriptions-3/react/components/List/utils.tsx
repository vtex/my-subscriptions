import type { SubscriptionStatus } from 'vtex.subscriptions-graphql'

export type SubscriptionDisplayFilter = 'ACTIVE_FILTER' | 'CANCELED_FILTER'

export const CSS = {
  subscriptionImageWrapper:
    'vtex-subscriptions-custom-image-size flex-none center overflow-hidden mb4',
  subscriptionItemWrapper:
    'subscription__listing-card mb4 bg-base pa0-ns pa3-s bb b--muted-5 flex flex-row-ns flex-column-s',
}

export function convertFilter(
  filter: SubscriptionDisplayFilter
): SubscriptionStatus[] {
  if (filter === 'CANCELED_FILTER') {
    return ['CANCELED']
  }

  return ['ACTIVE', 'PAUSED']
}
