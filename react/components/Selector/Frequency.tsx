import React, { FunctionComponent, FocusEvent } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { Frequency } from 'vtex.subscriptions-graphql'

import {
  getIntervalOptions,
  getFrequencyOptions,
  extractFrequency,
} from '../Frequency/utils'

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
  onBlurFrequency,
  onBlurPurchaseDay,
}) => {
  const currentFrequency = selectedFrequency
    ? extractFrequency(selectedFrequency)
    : null
  const hasFrequency = currentFrequency
    ? contains(availableFrequencies, currentFrequency)
    : false

  return (
    <>
      <Dropdown
        name="frequency"
        label={intl.formatMessage(messages.orderAgain)}
        placeholder={intl.formatMessage(messages.select)}
        options={getFrequencyOptions({
          intl,
          frequencies: availableFrequencies,
        })}
        value={hasFrequency ? selectedFrequency : null}
        onChange={onChangeFrequency}
        onBlur={onBlurFrequency}
      />
      {currentFrequency && currentFrequency?.periodicity !== 'DAILY' && (
        <div className="pt6">
          <Dropdown
            name="purchaseDay"
            label={intl.formatMessage(messages.chargeEvery)}
            placeholder={intl.formatMessage(messages.select)}
            options={getIntervalOptions({
              intl,
              periodicity: currentFrequency?.periodicity,
            })}
            value={selectedPurchaseDay}
            onChange={onChangePurchaseDay}
            onBlur={onBlurPurchaseDay}
          />
        </div>
      )}
    </>
  )
}

type Props = {
  onChangePurchaseDay: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlurPurchaseDay?: (e: FocusEvent) => void
  onChangeFrequency: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlurFrequency?: (e: FocusEvent) => void
  selectedPurchaseDay: string | null
  selectedFrequency: string | null
  availableFrequencies: Frequency[]
} & WrappedComponentProps

export default injectIntl(FrequencySelector)
