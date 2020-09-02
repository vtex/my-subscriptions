import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown, Button } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import { Result } from '../../../graphql/queries/availablePreferences.gql'
import { goToNReturn } from './utils'

function transformAddresses(addresses: Result['addresses']) {
  return addresses.map((address) => ({
    label: `${address.street}, ${address.number}`,
    value: address.id,
  }))
}

const AddressesSection: FunctionComponent<Props> = ({
  addresses,
  onChangeAddress,
  selectedAddressId,
  history,
}) => {
  return (
    <>
      <Dropdown
        label={<FormattedMessage id="store/display-address.label" />}
        options={transformAddresses(addresses)}
        value={selectedAddressId}
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
          <FormattedMessage id="store/subscription.shipping.newAddress" />
        </Button>
      </div>
    </>
  )
}

type Props = {
  addresses: Result['addresses']
  selectedAddressId: string | null
  onChangeAddress: (args: { addressId: string; addressType: string }) => void
} & RouteComponentProps

export default withRouter(AddressesSection)
