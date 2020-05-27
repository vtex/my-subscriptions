import { defineMessages, InjectedIntlProps } from 'react-intl'
import { Periodicity } from 'vtex.subscriptions-graphql'

const messages = defineMessages({
  day: {
    id: 'store/subscription.periodicity.day',
    defaultMessage: '',
  },
  week: {
    id: 'store/subscription.periodicity.week',
    defaultMessage: '',
  },
  month: {
    id: 'store/subscription.periodicity.month',
    defaultMessage: '',
  },
  year: {
    id: 'store/subscription.periodicity.year',
    defaultMessage: '',
  },
  biweekly: {
    id: 'store/subscription.periodicity.biweekly',
    defaultMessage: '',
  },
  bimonthly: {
    id: 'store/subscription.periodicity.bimonthly',
    defaultMessage: '',
  },
  semiannual: {
    id: 'store/subscription.periodicity.semiannual',
    defaultMessage: '',
  },
  yearly: {
    id: 'store/subscription.periodicity.yearly',
    defaultMessage: '',
  },
  every: {
    id: 'store/subscription.periodicity.every',
    defaultMessage: '',
  },
  monday: {
    id: 'store/subscription.periodicity.monday',
    defaultMessage: '',
  },
  tuesday: {
    id: 'store/subscription.periodicity.tuesday',
    defaultMessage: '',
  },
  wednesday: {
    id: 'store/subscription.periodicity.wednesday',
    defaultMessage: '',
  },
  thursday: {
    id: 'store/subscription.periodicity.thursday',
    defaultMessage: '',
  },
  friday: {
    id: 'store/subscription.periodicity.friday',
    defaultMessage: '',
  },
  saturday: {
    id: 'store/subscription.periodicity.saturday',
    defaultMessage: '',
  },
  sunday: {
    id: 'store/subscription.periodicity.sunday',
    defaultMessage: '',
  },
  weekly: {
    id: 'store/subscription.periodicity.weekly',
    defaultMessage: '',
  },
  daily: {
    id: 'store/subscription.periodicity.daily',
    defaultMessage: '',
  },
  monthly: {
    id: 'store/subscription.periodicity.monthly',
    defaultMessage: '',
  },
})

export function displayWeekDay({
  intl,
  weekDay,
}: { weekDay: string } & InjectedIntlProps) {
  return intl.formatMessage({
    id: `store/subscription.periodicity.${weekDay}`,
  })
}

export function displayPeriodicity({
  intl,
  periodicity,
  interval,
}: { periodicity: Periodicity; interval: number } & InjectedIntlProps) {
  return intl.formatMessage(
    {
      id: `store/subscription.periodicity.${periodicity.toLowerCase()}`,
    },
    { count: interval }
  )
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
  const periodicityText = displayPeriodicity({ intl, periodicity, interval })

  let frequencyText = periodicityText

  if (
    periodicity !== 'DAILY' &&
    purchaseDay != null &&
    purchaseDay !== 'Not_Applicable'
  ) {
    let moment = purchaseDay.toLowerCase()

    if (periodicity === 'WEEKLY') {
      moment = displayWeekDay({ weekDay: moment, intl }).toLocaleLowerCase()
    }

    const purchaseDayText = intl.formatMessage(messages.every, { moment })

    frequencyText = `${periodicityText}, ${purchaseDayText}`
  }

  return frequencyText
}

export const WEEK_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
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
