import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { Periodicity } from '../../constants'

import LabeledInfo from './LabeledInfo'

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
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
      <LabeledInfo labelId="subscription.frequency">
        {frequencyText}
      </LabeledInfo>
    )
  }

  return <Fragment>{frequencyText}</Fragment>
}

interface Props {
  interval: number
  purchaseDay: string
  periodicity: Periodicity
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
