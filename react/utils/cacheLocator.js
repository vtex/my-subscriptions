import { buildCacheLocator } from 'render'

const MY_SUBSCRIPTIONS_GRAPHQL = 'vtex.my-subscriptions-graphql@0.x'

export const cacheLocator = {
  groupedSubscription: id =>
    buildCacheLocator(MY_SUBSCRIPTIONS_GRAPHQL, 'GroupedSubscription', id),
}
