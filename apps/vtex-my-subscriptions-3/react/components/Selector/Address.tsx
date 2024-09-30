import type { FunctionComponent, ReactNode } from 'react'
import React from 'react'
import { compose } from 'recompose'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { Dropdown, Button } from 'vtex.styleguide'
import type { RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRouter } from 'vtex.my-account-commons/Router'
import type { Address } from 'vtex.subscriptions-graphql'

import { goToNReturn } from './utils'

function transformAddresses(addresses: Address[]) {
  return addresses.map(address => ({
    label: `${address.street} ${address.number ? `, ${address.number}` : ''}`,
    value: address.id,
  }))
}

const messages = defineMessages({
  select: { id: 'subscription.select' },
  label: { id: 'display-address.label' },
  addNew: { id: 'subscription.shipping.newAddress' },
})

const AddressSelector: FunctionComponent<Props> = ({
  addresses,
  onChangeAddress,
  onBlur,
  selectedAddressId,
  history,
  intl,
  errorMessage,
}) => (
  <>
    {addresses.length > 0 && (
      <Dropdown
        name="address"
        label={intl.formatMessage(messages.label)}
        options={transformAddresses(addresses)}
        placeholder={intl.formatMessage(messages.select)}
        value={selectedAddressId}
        error={selectedAddressId === null}
        onChange={(_: unknown, id: string) => {
          const address = addresses.find(item => item.id === id)

          if (!address) return

          onChangeAddress({
            addressId: address.id,
            addressType: address.addressType as string,
          })
        }}
        onBlur={onBlur}
        errorMessage={errorMessage}
      />
    )}
    <div className="mt3">
      <Button
        size="small"
        variation="tertiary"
        onClick={() => goToNReturn({ pathname: '/addresses/new', history })}
      >
        {intl.formatMessage(messages.addNew)}
      </Button>
    </div>
  </>
)

type OuterProps = {
  addresses: Address[]
  selectedAddressId: string | null
  onChangeAddress: (args: { addressId: string; addressType: string }) => void
  onBlur?: (e: FocusEvent) => void
  errorMessage?: string | ReactNode
}

type InnerProps = RouteComponentProps & WrappedComponentProps

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(injectIntl, withRouter)

export default enhance(AddressSelector)
