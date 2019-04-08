import React, { Fragment, FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import LabeledInfo from '../../../commons/LabeledInfo'

const ChargeDayInfo: FunctionComponent<Props> = ({ intl, subscriptionsGroup }) => {
  const shouldBeEmpty = subscriptionsGroup.purchaseSettings.purchaseDay === 'Not_Applicable' ||
  !subscriptionsGroup.purchaseSettings.purchaseDay
  const periodicity = subscriptionsGroup.plan.frequency.periodicity
  const purchaseDay = subscriptionsGroup.purchaseSettings.purchaseDay

  const chargeInfo =
    periodicity === 'WEEKLY'
      ? intl.formatMessage({
          id: `subscription.periodicity.${purchaseDay.toLowerCase()}`,
        })
      : purchaseDay

  const label = (
    <Fragment>
      {!shouldBeEmpty &&
        intl.formatMessage({ id: 'subscription.data.chargeDay' })}
      &nbsp;
    </Fragment>
  )
  return (
    <LabeledInfo label={label}>
      {!shouldBeEmpty && chargeInfo} &nbsp;
    </LabeledInfo>
  )
}

interface Props extends InjectedIntlProps {
  subscriptionsGroup: SubscriptionsGroupItemType,
}

export default injectIntl(ChargeDayInfo)
