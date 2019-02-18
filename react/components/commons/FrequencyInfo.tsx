import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

interface Props {
  periodicity: string
  interval: string | number
}

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
  intl,
  interval,
  periodicity,
}) => {
  return (
    <span className="t-body">
      {intl.formatMessage(
        {
          id: `subscription.settings.${periodicity.toLowerCase()}`,
        },
        { interval }
      )}
    </span>
  )
}

export default injectIntl(FrequencyInfo)
