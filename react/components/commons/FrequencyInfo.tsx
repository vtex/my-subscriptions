import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import LabeledInfo from '../../components/commons/LabeledInfo'

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
  intl,
  interval,
  periodicity,
}) => {
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

interface Props {
  periodicity: string
  interval: string | number
}

export default injectIntl(FrequencyInfo)
