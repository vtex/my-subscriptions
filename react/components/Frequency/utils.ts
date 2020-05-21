import { defineMessages, InjectedIntlProps } from 'react-intl'

import { Periodicity } from '../../constants'

defineMessages({
  day: {
    id: 'order.subscription.periodicity.day',
    defaultMessage: '',
  },
  week: {
    id: 'order.subscription.periodicity.week',
    defaultMessage: '',
  },
  month: {
    id: 'order.subscription.periodicity.month',
    defaultMessage: '',
  },
  year: {
    id: 'order.subscription.periodicity.year',
    defaultMessage: '',
  },
  daily: {
    id: 'order.subscription.periodicity.daily',
    defaultMessage: '',
  },
  weekly: {
    id: 'order.subscription.periodicity.weekly',
    defaultMessage: '',
  },
  monthly: {
    id: 'order.subscription.periodicity.monthly',
    defaultMessage: '',
  },
  biweekly: {
    id: 'order.subscription.periodicity.biweekly',
    defaultMessage: '',
  },
  bimonthly: {
    id: 'order.subscription.periodicity.bimonthly',
    defaultMessage: '',
  },
  semiannual: {
    id: 'order.subscription.periodicity.semiannual',
    defaultMessage: '',
  },
  yearly: {
    id: 'order.subscription.periodicity.yearly',
    defaultMessage: '',
  },
  weeklyStep: {
    id: 'order.subscription.periodicity.weekly.step',
    defaultMessage: '',
  },
  monthlyStep: {
    id: 'order.subscription.periodicity.monthly.step',
    defaultMessage: '',
  },
  yearlyStep: {
    id: 'order.subscription.periodicity.yearly.step',
    defaultMessage: '',
  },
  monday: {
    id: 'subscription.periodicity.monday',
    defaultMessage: '',
  },
  tuesday: {
    id: 'subscription.periodicity.tuesday',
    defaultMessage: '',
  },
  wednesday: {
    id: 'subscription.periodicity.wednesday',
    defaultMessage: '',
  },
  thursday: {
    id: 'subscription.periodicity.thursday',
    defaultMessage: '',
  },
  friday: {
    id: 'subscription.periodicity.friday',
    defaultMessage: '',
  },
  saturday: {
    id: 'subscription.periodicity.saturday',
    defaultMessage: '',
  },
  sunday: {
    id: 'subscription.periodicity.sunday',
    defaultMessage: '',
  },
  weekly2: {
    id: 'subscription.periodicity.weekly', // TODO remove duplicated string
    defaultMessage: '',
  },
  daily2: {
    id: 'subscription.periodicity.daily', // TODO remove duplicated string
    defaultMessage: '',
  },
  monthly2: {
    id: 'subscription.periodicity.monthly', // TODO remove duplicated string
    defaultMessage: '',
  },
})

export function displayWeekDay({
  intl,
  weekDay,
}: { weekDay: string } & InjectedIntlProps) {
  return intl.formatMessage({
    id: `subscription.periodicity.${weekDay}`,
  })
}

export function displayPeriodicity({
  intl,
  periodicity,
  interval,
}: { periodicity: Periodicity; interval: number } & InjectedIntlProps) {
  return intl.formatMessage(
    {
      id: `order.subscription.periodicity.${periodicity.toLowerCase()}`,
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
    periodicity !== Periodicity.Daily &&
    purchaseDay != null &&
    purchaseDay !== 'Not_Applicable'
  ) {
    let moment = purchaseDay.toLowerCase()

    if (periodicity === Periodicity.Weekly) {
      moment = displayWeekDay({ weekDay: moment, intl }).toLocaleLowerCase()
    }

    const purchaseDayText = intl.formatMessage(
      {
        id: `order.subscription.periodicity.${periodicity.toLowerCase()}.step`,
      },
      { moment }
    )

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
