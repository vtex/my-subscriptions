import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

import { Periodicity } from '../../constants'
import LabeledInfo from '../LabeledInfo'
import { displayFrequency } from './utils'

const messages = defineMessages({
  label: {
    id: 'store/subscription.frequency',
    defaultMessage: '',
  },
})

const FrequencyInfo: FunctionComponent<Props> = ({
  intl,
  displayLabel = true,
  periodicity,
  interval,
  purchaseDay,
}) => {
  const frequencyText = displayFrequency({
    periodicity,
    intl,
    interval,
    purchaseDay,
  })

  if (displayLabel) {
    return (
      <LabeledInfo label={intl.formatMessage(messages.label)}>
        {frequencyText}
      </LabeledInfo>
    )
  }

  return <Fragment>{frequencyText}</Fragment>
}

interface Props extends InjectedIntlProps {
  interval: number
  purchaseDay: string | null
  periodicity: Periodicity
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
