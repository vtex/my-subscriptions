import React, { FunctionComponent, FocusEvent, ReactNode } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Dropdown } from 'vtex.styleguide'
import { Frequency } from 'vtex.subscriptions-graphql'
import { useCssHandles } from 'vtex.css-handles'

import {
  getIntervalOptions,
  getFrequencyOptions,
  extractFrequency,
} from '../Frequency/utils'

const messages = defineMessages({
  orderAgain: { id: 'subscription.data.orderAgain' },
  select: { id: 'subscription.select' },
  chargeEvery: {
    id: 'subscription.data.chargeEvery',
  },
})

const CSS_HANDLES = ['purchaseDayContainer'] as const

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
  errorMessageFrequency,
  errorMessagePurchaseDay,
  isNewSubscription = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

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
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          onChangePurchaseDay(null)
          onChangeFrequency(e.target.value)
        }}
        onBlur={onBlurFrequency}
        errorMessage={errorMessageFrequency}
      />
      {availableFrequencies.length !== 0 &&
        currentFrequency &&
        currentFrequency.periodicity !== 'DAILY' && (
          <div
            className={`${handles.purchaseDayContainer}${
              isNewSubscription ? '-new' : ''
            } pt6`}
          >
            <Dropdown
              name="purchaseDay"
              placeholder={intl.formatMessage(messages.select)}
              label={intl.formatMessage(messages.chargeEvery)}
              options={getIntervalOptions({
                intl,
                periodicity: currentFrequency.periodicity,
              })}
              value={selectedPurchaseDay}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onChangePurchaseDay(e.target.value)
              }
              onBlur={onBlurPurchaseDay}
              errorMessage={errorMessagePurchaseDay}
            />
          </div>
        )}
    </>
  )
}

type Props = {
  onChangePurchaseDay: (day: string | null) => void
  onBlurPurchaseDay?: (e: FocusEvent) => void
  onChangeFrequency: (frequency: string) => void
  onBlurFrequency?: (e: FocusEvent) => void
  errorMessagePurchaseDay?: string | ReactNode
  errorMessageFrequency?: string | ReactNode
  selectedPurchaseDay: string | null
  selectedFrequency: string | null
  availableFrequencies: Frequency[]
  isNewSubscription?: boolean
} & WrappedComponentProps

export default injectIntl(FrequencySelector)
