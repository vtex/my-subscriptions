import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { Periodicity } from 'vtex.subscriptions-graphql'

import {
  translatePeriodicity,
  translatePurchaseDay,
} from '../../utils/translations'

import LabeledInfo from './LabeledInfo'

const messages = defineMessages({
  frequency: {
    id: 'subscription.frequency',
    defaultMessage: '',
  },
})

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
  intl,
  displayLabel = true,
  periodicity,
  interval,
  purchaseDay,
}) => {
  const periodicityText = translatePeriodicity(intl, periodicity, interval)
  const purchaseDayText = translatePurchaseDay(intl, periodicity, purchaseDay)
  const frequencyText =
    purchaseDayText === ''
      ? periodicityText
      : `${periodicityText}, ${purchaseDayText}`

  if (displayLabel) {
    return (
      <LabeledInfo labelId={messages.frequency}>{frequencyText}</LabeledInfo>
    )
  }

  return <Fragment>{frequencyText}</Fragment>
}

interface Props {
  interval: number
  purchaseDay?: string
  periodicity: Periodicity
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
