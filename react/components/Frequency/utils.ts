import { InjectedIntlProps } from 'react-intl'
import { Periodicity } from 'vtex.subscriptions-graphql'
import { translations } from 'vtex.subscriptions-commons'
import { WeekDay } from 'vtex.subscriptions-commons/react/utils/frequency'

export function displayWeekDay({
  intl,
  weekDay,
}: { weekDay: WeekDay } & InjectedIntlProps) {
  return translations.translateWeekDay({ intl, day: weekDay })
}

export function displayPeriodicity({
  intl,
  periodicity,
  interval,
}: { periodicity: Periodicity; interval: number } & InjectedIntlProps) {
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
} & InjectedIntlProps): string {
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
