import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import LabeledInfo from '../../components/commons/LabeledInfo'

const FrequencyInfo: FunctionComponent<Props & InjectedIntlProps> = ({
  intl,
  interval,
  periodicity,
  displayLabel = true,
}) => {
  const frequency = intl.formatMessage(
    {
      id: `subscription.settings.${periodicity.toLowerCase()}`,
    },
    { interval }
  )
  return displayLabel ? (
    <LabeledInfo labelId="subscription.frequency">{frequency}</LabeledInfo>
  ) : (
    <Fragment>{frequency}</Fragment>
  )
}

interface Props {
  periodicity: string
  interval: string | number
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
