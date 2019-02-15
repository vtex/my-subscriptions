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
  if (filter === SubscriptionDisplayFilterEnum.Canceled) {
    return [SubscriptionStatusEnum.Canceled]
  }

  return [SubscriptionStatusEnum.Active, SubscriptionStatusEnum.Paused]
}

export function convertStatusInTagType(
  status: SubscriptionStatusEnum
): TagTypeEnum | null {
  switch (status) {
    case SubscriptionStatusEnum.Canceled:
      return TagTypeEnum.Error
    case SubscriptionStatusEnum.Paused:
      return TagTypeEnum.Warning
    default:
      return null
  }
}
