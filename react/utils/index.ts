import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatusEnum,
  TagTypeEnum,
} from '../enums'

let guid = 1

export function getGUID() {
  return (guid++ * new Date().getTime() * -1).toString()
}

export function parseErrorMessageId(error: any): string {
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

export function convertFilter(
  filter: SubscriptionDisplayFilterEnum
): SubscriptionStatusEnum[] {
  if (filter === SubscriptionDisplayFilterEnum.CANCELED) {
    return [SubscriptionStatusEnum.CANCELED]
  }

  return [SubscriptionStatusEnum.ACTIVE, SubscriptionStatusEnum.PAUSED]
}

export function convertStatusInTagType(
  status: SubscriptionStatusEnum
): TagTypeEnum | null {
  switch (status) {
    case SubscriptionStatusEnum.CANCELED:
      return TagTypeEnum.ERROR
    case SubscriptionStatusEnum.PAUSED:
      return TagTypeEnum.WARNING
    default:
      return null
  }
}
