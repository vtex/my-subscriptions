import React, { FunctionComponent } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  defineMessages,
} from 'react-intl'
import { branch, compose, renderComponent } from 'recompose'
import { Button, Dropdown, Alert } from 'vtex.styleguide'
import { Address } from 'vtex.store-graphql'

import GET_ADDRESSES from '../../../graphql/getAddresses.gql'
import EditionButtons from '../EditionButtons'
import ShippingSkeleton from './ShippingSkeleton'
import { SubscriptionsGroup } from '..'
import { queryWrapper } from '../../../tracking'

const messages = defineMessages({
  address: {
    id: 'store/subscription.shipping.address',
    defaultMessage: '',
  },
})

function transformAddresses(addresses: Address[]) {
  return addresses.map((address) => ({
    label: `${address.street}, ${address.number}`,
    value: address.id,
  }))
}

const INSTANCE = 'SubscriptionsDetails/CustomerAddresses'

const EditShipping: FunctionComponent<Props> = ({
  addresses,
  selectedAddressId,
  onCloseErrorAlert,
  onChangeAddress,
  onGoToCreateAddress,
  onCancel,
  onSave,
  showErrorAlert,
  errorMessage,
  isLoading,
  intl,
}) => {
  return (
    <>
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="store/subscription.shipping" />
      </div>
      <div className="flex pt5 w-100-s mr-auto flex-column">
        {showErrorAlert && (
          <div className="mb5">
            <Alert type="error" onClose={onCloseErrorAlert}>
              {errorMessage}
            </Alert>
          </div>
        )}
        <div className="w-100">
          <Dropdown
            label={intl.formatMessage(messages.address)}
            options={transformAddresses(addresses)}
            value={selectedAddressId}
            onChange={onChangeAddress}
          />
        </div>
        <div className="pt3 pb4 nl5">
          <Button
            size="small"
            variation="tertiary"
            onClick={onGoToCreateAddress}
          >
            <FormattedMessage id="store/subscription.shipping.newAddress" />
          </Button>
        </div>
        <EditionButtons
          isLoading={isLoading}
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </>
  )
}

interface ChildProps {
  loading: boolean
  addresses: Address[]
}

interface InnerProps extends InjectedIntlProps {
  addresses: Address[]
}

interface OuterProps {
  onSave: () => void
  onCancel: () => void
  onChangeAddress: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onCloseErrorAlert: () => void
  onGoToCreateAddress: () => void
  group: SubscriptionsGroup
  selectedAddressId: string
  showErrorAlert: boolean
  errorMessage: string
  isLoading: boolean
}

type Props = InnerProps & OuterProps

export default compose<Props, OuterProps>(
  injectIntl,
  queryWrapper<
    OuterProps,
    { profile: { addresses: Address[] } },
    {},
    ChildProps
  >(INSTANCE, GET_ADDRESSES, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      addresses: data?.profile ? data.profile.addresses : [],
    }),
    options: {
      fetchPolicy: 'no-cache',
    },
  }),
  branch(
    ({ loading }: ChildProps) => loading,
    renderComponent(ShippingSkeleton)
  )
)(EditShipping)
