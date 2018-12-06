import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { compose, withProps } from 'recompose'

import { subscriptionShape } from '../proptypes'

const ChargeDayInfo = ({ intl, subscription, shouldBeEmpty }) => {
  if (shouldBeEmpty) return <div className="h2 mb2" />

  let chargeInfo
  if (subscription.plan.frequency.periodicity === 'WEEKLY') {
    chargeInfo = intl.formatMessage({
      id: `subscription.periodicity.${subscription.purchaseSettings.purchaseDay.toLowerCase()}`,
    })
  } else chargeInfo = subscription.purchaseSettings.purchaseDay

  return (
    <Fragment>
      <span className="b db f6 c-on-base">
        {intl.formatMessage({ id: 'subscription.data.chargeDay' })}
      </span>
      <span className="fw3 db f5-ns f6-s c-on-base">{chargeInfo}</span>
    </Fragment>
  )
}

ChargeDayInfo.propTypes = {
  intl: intlShape.isRequired,
  subscription: subscriptionShape.isRequired,
  shouldBeEmpty: PropTypes.bool.isRequired,
}

const enhance = compose(
  injectIntl,
  withProps(({ subscription }) => ({
    shouldBeEmpty:
      subscription.purchaseSettings.purchaseDay === 'Not_Applicable' ||
      !subscription.purchaseSettings.purchaseDay,
  }))
)

export default enhance(ChargeDayInfo)
