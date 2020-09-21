import React, { FunctionComponent } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { Frequency } from 'vtex.subscriptions-graphql'

import {
  getIntervalOptions,
  getFrequencyOptions,
  extractFrequency,
} from './utils'

const messages = defineMessages({
  orderAgain: { id: 'store/subscription.data.orderAgain' },
  select: { id: 'store/subscription.select' },
  chargeEvery: {
    id: 'store/subscription.data.chargeEvery',
  },
})

function contains(frequencies: Frequency[], currentFrequency: Frequency) {
  return frequencies.some((frequency) => {
    if (
      frequency.periodicity !== currentFrequency.periodicity ||
      frequency.interval !== currentFrequency.interval
    )
      return false

    return true
  })
}

const FrequencySelector: FunctionComponent<Props> = ({
  intl,
  selectedFrequency,
  selectedPurchaseDay,
  availableFrequencies = [],
  onChangeFrequency,
  onChangePurchaseDay,
}) => {
  const currentFrequency = extractFrequency(selectedFrequency)
  const hasFrequency = contains(availableFrequencies, currentFrequency)

  return (
    <>
      <Dropdown
        label={intl.formatMessage(messages.orderAgain)}
        placeholder={intl.formatMessage(messages.select)}
        options={getFrequencyOptions({
          intl,
          frequencies: availableFrequencies,
        })}
        value={hasFrequency ? selectedFrequency : null}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChangeFrequency(e.target.value)
        }
      />
      {currentFrequency.periodicity !== 'DAILY' && (
        <div className="pt6">
          <Dropdown
            label={intl.formatMessage(messages.chargeEvery)}
            placeholder={intl.formatMessage(messages.select)}
            options={getIntervalOptions({
              intl,
              periodicity: currentFrequency.periodicity,
            })}
            value={selectedPurchaseDay}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onChangePurchaseDay(e.target.value)
            }
          />
        </div>
      )}
    </>
  )
}

type Props = {
  onChangePurchaseDay: (day: string) => void
  onChangeFrequency: (frequency: string) => void
  selectedPurchaseDay: string
  selectedFrequency: string
  availableFrequencies: Frequency[]
} & WrappedComponentProps

export default injectIntl(FrequencySelector)
