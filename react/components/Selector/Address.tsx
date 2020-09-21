import React, { FunctionComponent } from 'react'
import { compose } from 'recompose'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { Dropdown, Button } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { Address } from 'vtex.subscriptions-graphql'

import { goToNReturn } from './utils'

function transformAddresses(addresses: Address[]) {
  return addresses.map((address) => ({
    label: `${address.street}, ${address.number}`,
    value: address.id,
  }))
}

const messages = defineMessages({
  select: { id: 'store/subscription.select' },
  label: { id: 'store/display-address.label' },
  addNew: { id: 'store/subscription.shipping.newAddress' },
})

const AddressSelector: FunctionComponent<Props> = ({
  addresses,
  onChangeAddress,
  selectedAddressId,
  history,
  intl,
}) => (
  <>
    <Dropdown
      label={intl.formatMessage(messages.label)}
      options={transformAddresses(addresses)}
      placeholder={intl.formatMessage(messages.select)}
      value={selectedAddressId}
      error={selectedAddressId === null}
      onChange={(_: unknown, id: string) => {
        const address = addresses.find((item) => item.id === id)

        if (!address) return

        onChangeAddress({
          addressId: address.id,
          addressType: address.addressType as string,
        })
      }}
    />
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
}

type InnerProps = RouteComponentProps & WrappedComponentProps

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(injectIntl, withRouter)

export default enhance(AddressSelector)
