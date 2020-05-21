import { RuntimeContext } from 'vtex.render-runtime'
import { ApolloError } from 'apollo-client'
import qs from 'query-string'
import { RouteComponentProps } from 'vtex.my-account-commons/Router'

import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatus,
  MenuOptionsEnum,
  EditOptions,
} from '../constants'
import { logMetric } from '../tracking'

export function parseErrorMessageId(error: ApolloError): string {
  if (
    error &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions &&
    error.graphQLErrors[0].extensions
  ) {
    return `subscription.fetch.${
      (error.graphQLErrors[0].extensions.error &&
        error.graphQLErrors[0].extensions.error.statusCode &&
        error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
      'timeout'
    }`
  }

  return ''
}

export function convertFilter(
  filter: SubscriptionDisplayFilterEnum
): SubscriptionStatus[] {
  if (filter === SubscriptionDisplayFilterEnum.Canceled) {
    return [SubscriptionStatus.Canceled]
  }

  return [SubscriptionStatus.Active, SubscriptionStatus.Paused]
}

export const makeCancelable = (promise: Promise<unknown>) => {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    },
  }
}

export function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus,
  orderFormId: string | undefined
) {
  const options = isSkipped
    ? [MenuOptionsEnum.Unskip, MenuOptionsEnum.Pause, MenuOptionsEnum.Cancel]
    : status === SubscriptionStatus.Paused
    ? [MenuOptionsEnum.Restore, MenuOptionsEnum.Cancel]
    : [MenuOptionsEnum.Skip, MenuOptionsEnum.Pause, MenuOptionsEnum.Cancel]

  if (orderFormId) {
    options.push(MenuOptionsEnum.OrderNow)
  }

  return options
}

export function logOrderNowMetric(runtime: RuntimeContext, orderGroup: string) {
  logMetric({
    runtime,
    metricName: 'OrderNow',
    data: {
      orderGroup,
    },
  })
}

type Location = RouteComponentProps['location']

export function getEditOption(location: Location): EditOptions | null {
  const parsed = qs.parse(location.search)

  switch (parsed.edit) {
    case EditOptions.Payment:
      return EditOptions.Payment
    case EditOptions.Address:
      return EditOptions.Address
    default:
      return null
  }
}

export function scrollToElement(id: string) {
  const div = document.getElementById(id)
  div?.scrollIntoView({ block: 'center' })
}

export function removeElementsFromSearch(
  elements: string[],
  location: Location
) {
  const parsed = qs.parse(location.search)

  elements.forEach((elementName) => delete parsed[elementName])

  return qs.stringify(parsed)
}
