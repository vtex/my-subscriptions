import type { WrappedComponentProps, IntlShape } from 'react-intl'
import { defineMessages } from 'react-intl'
import type { Periodicity, Frequency } from 'vtex.subscriptions-graphql'
import { translations } from 'vtex.subscriptions-commons'
import type { WeekDay } from 'vtex.subscriptions-commons/react/utils/frequency'

const messages = defineMessages({
  selectDay: { id: 'subscription.select.day' },
})

function displayWeekDay({
  intl,
  weekDay,
}: { weekDay: WeekDay } & WrappedComponentProps) {
  return translations.translateWeekDay({ intl, day: weekDay })
}

function displayPeriodicity({
  intl,
  periodicity,
  interval,
}: { periodicity: Periodicity; interval: number } & WrappedComponentProps) {
  return translations.translatePeriodicity(intl, periodicity, interval)
}

export function displayFrequency({
  interval,
  purchaseDay,
  periodicity,
  intl,
}: {
  interval: number
  purchaseDay: string | null
  periodicity: Periodicity
} & WrappedComponentProps): string {
  const periodicityText = translations.translatePeriodicity(
    intl,
    periodicity,
    interval
  )

  let frequencyText = periodicityText
  const purchaseDayText = translations.translatePurchaseDay(
    intl,
    periodicity,
    purchaseDay ?? undefined
  )

  if (purchaseDayText !== '') {
    frequencyText = `${periodicityText}, ${purchaseDayText}`
  }

  return frequencyText
}

export const WEEK_OPTIONS: WeekDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const MONTH_OPTIONS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
]

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
  periodicity: Exclude<Periodicity, 'DAILY'>
  intl: IntlShape
}) {
  if (periodicity === 'WEEKLY') {
    return WEEK_OPTIONS.map(weekDay => ({
      value: weekDay,
      label: displayWeekDay({ weekDay, intl }),
    }))
  }

  return MONTH_OPTIONS.map(dayOfMonth => ({
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
  return frequencies.map(frequency => ({
    value: frequencyIndex(frequency),
    label: displayPeriodicity({ intl, ...frequency }),
  }))
}
