import React, { FunctionComponent, FocusEvent, ReactNode } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Dropdown, ButtonGroup, Button } from 'vtex.styleguide'
import { Frequency } from 'vtex.subscriptions-graphql'

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
}) => {
  const currentFrequency = selectedFrequency
    ? extractFrequency(selectedFrequency)
    : null
  const hasFrequency = currentFrequency
    ? contains(availableFrequencies, currentFrequency)
    : false

  return (
    <>
      <div style={{ maxWidth: '220px' }}>
        <Dropdown
          name="frequency"
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
          onBlur={onBlurFrequency}
          errorMessage={errorMessageFrequency}
        />
      </div>
      {availableFrequencies.length !== 0 &&
        currentFrequency &&
        String(currentFrequency?.periodicity) === 'WEEKLY' && (
          <div className="pt3">
            <p className="mb3 t-small">
              {intl.formatMessage(messages.chargeEvery)}
            </p>
            <ButtonGroup
              buttons={getIntervalOptions({
                intl,
                periodicity: 'WEEKLY',
              }).map((day) => (
                <Button
                  key={day.value}
                  size="small"
                  isActiveOfGroup={day.value === selectedPurchaseDay}
                  onClick={() => onChangePurchaseDay(day.value)}
                >
                  {day.label.charAt(0)}
                </Button>
              ))}
            />
          </div>
        )}
      {availableFrequencies.length !== 0 &&
        currentFrequency &&
        (String(currentFrequency?.periodicity) === 'MONTHLY' ||
          String(currentFrequency?.periodicity) === 'YEARLY') && (
          <div className="pt6" style={{ width: '100px' }}>
            <Dropdown
              name="purchaseDay"
              label={intl.formatMessage(messages.chargeEvery)}
              options={getIntervalOptions({
                intl,
                periodicity: 'MONTHLY',
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
  onChangePurchaseDay: (day: string) => void
  onBlurPurchaseDay?: (e: FocusEvent) => void
  onChangeFrequency: (frequency: string) => void
  onBlurFrequency?: (e: FocusEvent) => void
  errorMessagePurchaseDay?: string | ReactNode
  errorMessageFrequency?: string | ReactNode
  selectedPurchaseDay: string | null
  selectedFrequency: string | null
  availableFrequencies: Frequency[]
} & WrappedComponentProps

export default injectIntl(FrequencySelector)
