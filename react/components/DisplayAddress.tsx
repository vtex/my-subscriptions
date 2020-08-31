import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { Address } from 'vtex.subscriptions-graphql'
import { AddressRules, AddressSummary } from 'vtex.address-form'

import Label from './LabeledInfo'
import Error from './CustomErrorAlert'

const messages = defineMessages({
  label: {
    id: 'store/display-address.label',
  },
  deletedError: {
    id: 'store/display-address.deleted-error-message',
  },
})

const DisplayAddress: FunctionComponent<Props> = ({ intl, address }) => (
  <Label label={intl.formatMessage(messages.label)}>
    {address ? (
      <AddressRules country={address.country} shouldUseIOFetching>
        <AddressSummary address={address} />
      </AddressRules>
    ) : (
      <Error>{intl.formatMessage(messages.deletedError)}</Error>
    )}
  </Label>
)

interface Props extends WrappedComponentProps {
  address: Address | null
}

export default injectIntl(DisplayAddress)
