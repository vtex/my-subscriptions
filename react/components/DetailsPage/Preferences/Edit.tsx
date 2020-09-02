import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { compose, branch, renderComponent } from 'recompose'
import { Plan, PaymentSystemGroup, Frequency } from 'vtex.subscriptions-graphql'
import { Dropdown, Alert } from 'vtex.styleguide'

import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'
import { queryWrapper } from '../../../tracking'
import QUERY, {
  Result,
  Args,
} from '../../../graphql/queries/availablePreferences.gql'
import { INSTANCE } from '..'
import Skeleton from './Skeleton'
import EditionButtons from '../EditionButtons'
import {
  getIntervalOptions,
  getFrequencyOptions,
  extractFrequency,
} from './utils'
import PaymentsSection from './PaymentsSection'
import AddressesSection from './AddressesSection'

const messages = defineMessages({
  title: {
    id: 'store/details-page.preferences.title',
  },
  orderAgain: { id: 'store/subscription.data.orderAgain' },
  chargeEvery: {
    id: 'store/subscription.data.chargeEvery',
  },
  select: { id: 'store/subscription.select' },
})

function contains(
  frequencies: Result['frequencies'],
  currentFrequency: Frequency
) {
  let result = false

  frequencies.forEach((frequency) => {
    if (
      frequency.periodicity !== currentFrequency.periodicity ||
      frequency.interval !== currentFrequency.interval
    )
      return

    result = true
  })

  return result
}

const EditPreferences: FunctionComponent<Props> = ({
  intl,
  isLoading,
  onCancel,
  onDismissError,
  onSave,
  onChangeFrequency,
  onChangePurchaseDay,
  errorMessage,
  selectedFrequency,
  selectedPurchaseDay,
  frequencies = [],
  payments = [],
  selectedPaymentSystemGroup,
  onChangePaymentSystemGroup,
  onChangePaymentAccount,
  selectedPaymentAccountId,
  addresses = [],
  onChangeAddress,
  selectedAddressId,
}) => {
  const currentFrequency = extractFrequency(selectedFrequency)
  const hasFrequency = contains(frequencies, currentFrequency)

  return (
    <Box title={intl.formatMessage(messages.title)}>
      <Section borderTop>
        {errorMessage && (
          <div className="mb6">
            <Alert type="error" onClose={onDismissError}>
              {errorMessage}
            </Alert>
          </div>
        )}
        <Dropdown
          label={intl.formatMessage(messages.orderAgain)}
          placeholder={intl.formatMessage(messages.select)}
          options={getFrequencyOptions({ intl, frequencies })}
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
      </Section>
      <Section>
        <PaymentsSection
          payments={payments}
          onChangePaymentAccount={onChangePaymentAccount}
          selectedPaymentAccountId={selectedPaymentAccountId}
          selectedPaymentSystemGroup={selectedPaymentSystemGroup}
          onChangePaymentSystemGroup={onChangePaymentSystemGroup}
        />
      </Section>
      <Section>
        <AddressesSection
          addresses={addresses}
          onChangeAddress={onChangeAddress}
          selectedAddressId={selectedAddressId}
        />
      </Section>
      <div className="w-100 ph7 pt7 flex justify-end">
        <EditionButtons
          isLoading={isLoading}
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </Box>
  )
}

type OuterProps = {
  subscriptionId: string
  plan: Plan
  onSave: () => void
  onCancel: () => void
  onDismissError: () => void
  onChangePurchaseDay: (day: string) => void
  onChangeFrequency: (frequency: string) => void
  isLoading: boolean
  errorMessage: string | null
  selectedPurchaseDay: string
  selectedFrequency: string
  selectedPaymentSystemGroup: PaymentSystemGroup | null
  onChangePaymentSystemGroup: (args: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) => void
  selectedPaymentAccountId: string | null
  onChangePaymentAccount: (args: {
    paymentSystemId: string
    paymentAccountId: string
  }) => void
  selectedAddressId: string | null
  onChangeAddress: (args: { addressId: string; addressType: string }) => void
}

type ChildProps = {
  loading: boolean
  addresses?: Result['addresses']
  frequencies?: Result['frequencies']
  payments?: Result['payments']
}

type Props = OuterProps & ChildProps & WrappedComponentProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  queryWrapper<OuterProps, Result, Args, ChildProps>(
    `${INSTANCE}/EditPreferences`,
    QUERY,
    {
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        addresses: data?.addresses,
        frequencies: data?.frequencies,
        payments: data?.payments,
      }),
    }
  ),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(EditPreferences)
