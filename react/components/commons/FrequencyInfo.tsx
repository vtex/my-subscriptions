import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import LabeledInfo from '../../components/commons/LabeledInfo'

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
  intl,
  subscriptionsGroup: { plan, purchaseSettings },
  displayLabel = true,
}) => {
  const { interval } = plan.frequency
  const periodicity = plan.frequency.periodicity.toLowerCase()

  const periodicityText = intl.formatMessage(
    { id: `order.subscription.periodicity.${periodicity}` },
    { count: interval }
  )

  let frequencyText = periodicityText

  if (periodicity !== 'daily' && purchaseSettings != null) {
    let { purchaseDay } = purchaseSettings

    if (purchaseDay != null && purchaseDay !== 'Not_Applicable') {
      let moment = purchaseDay.toLowerCase()

      if (periodicity === 'weekly') {
        moment = intl
          .formatMessage({ id: `subscription.periodicity.${moment}` })
          .toLocaleLowerCase()
      }

      const purchaseDayText = intl.formatMessage(
        { id: `order.subscription.periodicity.${periodicity}.step` },
        { moment }
      )

      frequencyText = `${periodicityText}, ${purchaseDayText}`
    }
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
  subscriptionsGroup: SubscriptionsGroupItemType
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
