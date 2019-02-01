import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { compose, withProps } from 'recompose'

import LabeledInfo from './LabeledInfo'

const ChargeDayInfo = ({ intl, periodicity, purchaseDay, shouldBeEmpty }) => {
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

ChargeDayInfo.propTypes = {
  intl: intlShape.isRequired,
  periodicity: PropTypes.string.isRequired,
  purchaseDay: PropTypes.string.isRequired,
  shouldBeEmpty: PropTypes.bool.isRequired,
}

const enhance = compose(
  injectIntl,
  withProps(({ subscriptionsGroup }) => ({
    shouldBeEmpty:
      subscriptionsGroup.purchaseSettings.purchaseDay === 'Not_Applicable' ||
      !subscriptionsGroup.purchaseSettings.purchaseDay,
    periodicity: subscriptionsGroup.plan.frequency,
    purchaseDay: subscriptionsGroup.purchaseSettings.purchaseDay,
  }))
)

export default enhance(ChargeDayInfo)
