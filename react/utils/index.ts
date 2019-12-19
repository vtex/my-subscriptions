import { ApolloError } from 'apollo-client'
import axios from 'axios'
import SplunkEvents from 'splunk-events'
import {
  SubscriptionStatus,
  SubscriptionOrderStatus,
  SubscriptionsGroup,
} from 'vtex.subscriptions-graphql'

import { SubscriptionState, SubscriptionDisplayFilterEnum } from '../constants'

const splunkEvents = new SplunkEvents()

splunkEvents.config({
  endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
  token: 'bdb546bd-456f-41e2-8c58-00aae10331ab',
  request: axios,
})

export function parseErrorMessageId(error: ApolloError): string {
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

export function logOrderNowMetric(account: string, orderGroup: string) {
  splunkEvents.logEvent(
    'Important',
    'Info',
    'details/orderNow',
    orderGroup,
    {
      // eslint-disable-next-line no-undef
      ['app_version']: process.env.VTEX_APP_ID,
    },
    account
  )
}

export function isEditionEnabled(subscriptionStatus: SubscriptionStatus) {
  return subscriptionStatus === SubscriptionStatus.Active
}

type Group = Pick<
  SubscriptionsGroup,
  'purchaseSettings' | 'isSkipped' | 'status' | 'shippingAddress'
> & {
  lastOrder: {
    status: SubscriptionOrderStatus
  } | null
}

export function retrieveSubscriptionState(group: Group) {
  if (group.status === SubscriptionStatus.Paused) {
    return SubscriptionState.Paused
  } else if (group.status === SubscriptionStatus.Canceled) {
    return SubscriptionState.Canceled
  } else if (group.isSkipped) {
    return SubscriptionState.Skipped
  } else if (group.shippingAddress === null) {
    return SubscriptionState.InvalidAddress
  } else if (group.purchaseSettings.paymentMethod === null) {
    return SubscriptionState.InvalidPayment
  } else if (group.lastOrder?.status === SubscriptionOrderStatus.PaymentError) {
    return SubscriptionState.PaymentError
  }

  return SubscriptionState.NextDelivery
}
