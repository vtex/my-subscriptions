import { ApolloError } from 'apollo-client'
import axios from 'axios'
import SplunkEvents from 'splunk-events'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { SubscriptionDisplayFilterEnum, MenuOptionsEnum } from '../constants'

const splunkEvents = new SplunkEvents()

splunkEvents.config({
  endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
  token: 'bdb546bd-456f-41e2-8c58-00aae10331ab',
  request: axios,
})

export function parseErrorMessageId(error?: ApolloError): string {
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
    return ['CANCELED']
  }

  return ['ACTIVE', 'PAUSED']
}

export const makeCancelable = (promise: Promise<unknown>) => {
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

export function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus
) {
  return isSkipped
    ? [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Unskip,
        MenuOptionsEnum.Pause,
        MenuOptionsEnum.Cancel,
      ]
    : status === 'PAUSED'
    ? [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Restore,
        MenuOptionsEnum.Cancel,
      ]
    : [
        MenuOptionsEnum.OrderNow,
        MenuOptionsEnum.Skip,
        MenuOptionsEnum.Pause,
        MenuOptionsEnum.Cancel,
      ]
}

export function logOrderNowMetric(account: string, orderGroup: string) {
  splunkEvents.logEvent(
    'Important',
    'Info',
    'details/orderNow',
    orderGroup,
    {
      // eslint-disable-next-line no-undef
      app_version: process.env.VTEX_APP_ID,
    },
    account
  )
}
