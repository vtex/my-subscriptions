import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import LabeledInfo from './LabeledInfo'

const FrequencyInfo = ({ intl, interval, periodicity }) => {
  return (
    <LabeledInfo labelId="subscription.frequency">
      {intl.formatMessage(
        {
          id: `subscription.settings.${periodicity.toLowerCase()}`,
        },
        { interval }
      )}
    </LabeledInfo>
  )
}

FrequencyInfo.propTypes = {
  intl: intlShape.isRequired,
  periodicity: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
}

export default injectIntl(FrequencyInfo)
