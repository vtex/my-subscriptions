import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatusEnum,
  TagTypeEnum,
} from '../enums'

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

export function retrieveMessagesByStatus(status: SubscriptionStatusEnum) {
  let titleMessageId = ''
  let bodyMessageId = ''

  switch (status) {
    case SubscriptionStatusEnum.ACTIVE:
      titleMessageId = 'subscription.restore.title'
      bodyMessageId = 'subscription.restore.text'
      break
    case SubscriptionStatusEnum.PAUSED:
      titleMessageId = 'subscription.pause.title'
      bodyMessageId = 'subscription.pause.text'
      break
    case SubscriptionStatusEnum.CANCELED:
      titleMessageId = 'subscription.cancel.title'
      bodyMessageId = 'subscription.cancel.text'
      break
  }

  return {
    bodyMessageId,
    cancelationMessageId: 'subscription.change.status.modal.cancelation',
    confirmationMessageId: 'subscription.change.status.modal.confirmation',
    titleMessageId,
  }
}

export const makeCancelable = (promise: Promise<any>) => {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    },
  }
}
