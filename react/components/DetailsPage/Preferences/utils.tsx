import { IntlShape, defineMessages } from 'react-intl'
import { Frequency, Periodicity } from 'vtex.subscriptions-graphql'

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
