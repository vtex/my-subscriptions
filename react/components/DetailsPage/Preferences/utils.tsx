import { IntlShape, defineMessages } from 'react-intl'
import qs from 'query-string'
import {
  Frequency,
  Periodicity,
  PaymentMethod,
} from 'vtex.subscriptions-graphql'
import { utils } from 'vtex.payment-flags'
import { RouteComponentProps } from 'vtex.my-account-commons/Router'

import {
  displayWeekDay,
  displayPeriodicity,
  WEEK_OPTIONS,
  MONTH_OPTIONS,
} from '../../Frequency/utils'

const messages = defineMessages({
  selectDay: { id: 'store/subscription.select.day' },
})

export function frequencyIndex({ interval, periodicity }: Frequency) {
  return `${interval},${periodicity}`
}

export function extractFrequency(currentFrequency: string): Frequency {
  const [interval, periodicity] = currentFrequency.split(',')

  return {
    interval: parseInt(interval, 10),
    periodicity: periodicity as Frequency['periodicity'],
  }
}

export function getIntervalOptions({
  periodicity,
  intl,
}: {
  periodicity: Periodicity
  intl: IntlShape
}) {
  if (periodicity === 'WEEKLY') {
    return WEEK_OPTIONS.map((weekDay) => ({
      value: weekDay,
      label: displayWeekDay({ weekDay, intl }),
    }))
  }

  return MONTH_OPTIONS.map((dayOfMonth) => ({
    value: dayOfMonth,
    label: intl.formatMessage(messages.selectDay, { day: dayOfMonth }),
  }))
}

export function getFrequencyOptions({
  intl,
  frequencies = [],
}: {
  intl: IntlShape
  frequencies: Frequency[] | undefined
}) {
  return frequencies.map((frequency) => ({
    value: frequencyIndex(frequency),
    label: displayPeriodicity({ intl, ...frequency }),
  }))
}

type GroupedPayments = {
  [index: string]: PaymentMethod[]
}

export function groupPayments(payments: PaymentMethod[]): GroupedPayments {
  return payments.reduce<GroupedPayments>((prev, current) => {
    if (prev[current.paymentSystemGroup as string]) {
      return {
        ...prev,
        [current.paymentSystemGroup]: [
          ...prev[current.paymentSystemGroup],
          current,
        ],
      }
    }
    return {
      ...prev,
      [current.paymentSystemGroup]: [current],
    }
  }, {})
}

export function creditCardOptions(
  creditCards: PaymentMethod[],
  intl: IntlShape
) {
  return creditCards.map(
    ({ paymentSystemGroup, paymentSystemName, paymentAccount }) => ({
      label: utils.displayPayment({
        intl,
        paymentSystemGroup,
        paymentSystemName,
        lastDigits: paymentAccount?.cardNumber.slice(-4),
      }),
      value: paymentAccount?.id,
    })
  )
}
export function getCreditCard(
  accountId: string,
  cards: PaymentMethod[]
): PaymentMethod {
  return cards.find((card) => {
    const id = card.paymentAccount ? card.paymentAccount.id : null

    return id === accountId
  }) as PaymentMethod
}

export function goToNReturn({
  history,
  pathname,
}: {
  history: RouteComponentProps['history']
  pathname: string
}) {
  history.push({
    pathname,
    search: `?returnUrl=${history.location.pathname}`,
  })
}

export type EditOptions = 'payment' | 'address'

type Location = RouteComponentProps['location']

function removeElementsFromSearch(elements: string[], location: Location) {
  const parsed = qs.parse(location.search)

  elements.forEach((elementName) => delete parsed[elementName])

  return qs.stringify(parsed)
}

export function getAddressArgs(location: Location) {
  const args = qs.parse(location.search)

  if (args.newAddressId) {
    return {
      id: args.newAddressId as string,
      type: (args.newAddressType ?? 'residential') as string,
    }
  }

  return null
}

export function getPaymentArgs(location: Location) {
  const args = qs.parse(location.search)

  if (args.newPaymentSystemId && args.newPaymentAccountId) {
    return {
      paymentAccountId: args.newPaymentAccountId as string,
      paymentSystemId: args.newPaymentSystemId as string,
    }
  }

  return null
}

export function removeArgs(location: Location) {
  return removeElementsFromSearch(
    [
      'newPaymentAccountId',
      'newPaymentSystemId',
      'newAddressId',
      'newAddressType',
    ],
    location
  )
}
