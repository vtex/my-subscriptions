import type { FunctionComponent } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { compose, branch, renderComponent } from 'recompose'
import type { Plan, PaymentSystemGroup } from 'vtex.subscriptions-graphql'
import { Alert } from 'vtex.styleguide'

import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'
import { withQueryWrapper, getRuntimeInfo } from '../../../tracking'
import type {
  Result,
  Args,
} from '../../../graphql/queries/availablePreferences.gql'
import QUERY from '../../../graphql/queries/availablePreferences.gql'
import FrequencySelector from '../../Selector/Frequency'
import Skeleton from './Skeleton'
import EditionButtons from '../EditionButtons'
import PaymentSelector from '../../Selector/Payment'
import AddressSelector from '../../Selector/Address'

const messages = defineMessages({
  title: {
    id: 'details-page.preferences.title',
  },
})

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
}) => (
  <Box title={intl.formatMessage(messages.title)}>
    <Section borderTop borderBottom>
      {errorMessage && (
        <div className="mb6">
          <Alert type="error" onClose={onDismissError}>
            {errorMessage}
          </Alert>
        </div>
      )}
      <FrequencySelector
        availableFrequencies={frequencies}
        onChangeFrequency={onChangeFrequency}
        onChangePurchaseDay={onChangePurchaseDay}
        selectedFrequency={selectedFrequency}
        selectedPurchaseDay={selectedPurchaseDay}
      />
    </Section>
    <Section borderBottom>
      <PaymentSelector
        payments={payments}
        onChangePaymentAccount={onChangePaymentAccount}
        selectedPaymentAccountId={selectedPaymentAccountId}
        selectedPaymentSystemGroup={selectedPaymentSystemGroup}
        onChangePaymentSystemGroup={onChangePaymentSystemGroup}
      />
    </Section>
    <Section borderBottom>
      <AddressSelector
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

type OuterProps = {
  subscriptionId: string
  plan: Plan
  onSave: () => void
  onCancel: () => void
  onDismissError: () => void
  onChangePurchaseDay: (day: string | null) => void
  onChangeFrequency: (frequency: string) => void
  isLoading: boolean
  errorMessage: string | null
  selectedPurchaseDay: string | null
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
  withQueryWrapper<OuterProps, Result, Args, ChildProps>({
    workflowInstance: 'SubscriptionsDetails/EditPreferences',
    document: QUERY,
    getRuntimeInfo,
    operationOptions: {
      options: {
        fetchPolicy: 'network-only',
      },
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        addresses: data?.addresses,
        frequencies: data?.frequencies,
        payments: data?.payments,
      }),
    },
  }),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(EditPreferences)
