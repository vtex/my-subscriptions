import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

import { Periodicity } from '../../constants'
import LabeledInfo from './LabeledInfo'

const messages = defineMessages({
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
  quaterly: {
    id: 'order.subscription.periodicity.quaterly',
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
  frequency: {
    id: 'subscription.frequency',
    defaultMessage: '',
  },
})

const FrequencyInfo: FunctionComponent<Props> = ({
  intl,
  displayLabel = true,
  periodicity,
  interval,
  purchaseDay,
}) => {
  const periodicityText = intl.formatMessage(
    { id: `order.subscription.periodicity.${periodicity.toLowerCase()}` },
    { count: interval }
  )

  let frequencyText = periodicityText

  if (
    periodicity !== Periodicity.Daily &&
    purchaseDay != null &&
    purchaseDay !== 'Not_Applicable'
  ) {
    let moment = purchaseDay.toLowerCase()

    if (periodicity === Periodicity.Weekly) {
      moment = intl
        .formatMessage({ id: `subscription.periodicity.${moment}` })
        .toLocaleLowerCase()
    }

    const purchaseDayText = intl.formatMessage(
      {
        id: `order.subscription.periodicity.${periodicity.toLowerCase()}.step`,
      },
      { moment }
    )

    frequencyText = `${periodicityText}, ${purchaseDayText}`
  }

  if (displayLabel) {
    return (
      <LabeledInfo label={intl.formatMessage(messages.frequency)}>
        {frequencyText}
      </LabeledInfo>
    )
  }

  return <Fragment>{frequencyText}</Fragment>
}

interface Props extends InjectedIntlProps {
  interval: number
  purchaseDay: string | null
  periodicity: Periodicity
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
