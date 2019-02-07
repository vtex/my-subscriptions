import { SubscriptionDisplayFilter, SubscriptionStatus } from '../enums'

let guid = 1

export function getGUID() {
  return (guid++ * new Date().getTime() * -1).toString()
}

export function parseErrorMessageId(error: any) : string {
  if (
    error &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions &&
    error.graphQLErrors[0].extensions
  ) {
    return `subscription.fetch.${(error.graphQLErrors[0].extensions.error &&
      error.graphQLErrors[0].extensions.error.statusCode &&
      error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
      'timeout'}`
  }

  return ''
}

export function convertFilter(filter: SubscriptionDisplayFilter) {
  if (filter === SubscriptionDisplayFilter.Canceled) {
    return [SubscriptionStatus.Canceled]
  }
  
  return [SubscriptionStatus.Active, SubscriptionStatus.Paused]
}
