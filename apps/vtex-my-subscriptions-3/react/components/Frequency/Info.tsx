import type { FunctionComponent } from 'react'
import React, { Fragment } from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import type { Periodicity } from 'vtex.subscriptions-graphql'

import LabeledInfo from '../LabeledInfo'
import { displayFrequency } from './utils'

const messages = defineMessages({
  label: {
    id: 'subscription.frequency',
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

interface Props extends WrappedComponentProps {
  interval: number
  purchaseDay: string | null
  periodicity: Periodicity
  displayLabel?: boolean
}

export default injectIntl(FrequencyInfo)
