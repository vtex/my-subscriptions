import React, { FunctionComponent } from 'react'
import {
  injectIntl,
  FormattedMessage,
  defineMessages,
  WrappedComponentProps,
} from 'react-intl'
import { AddressRules, AddressSummary } from 'vtex.address-form'

import LabeledInfo from '../../LabeledInfo'
import EditButton from '../EditButton'
import EditAlert from '../EditAlert'
import { Subscription } from '..'

const messages = defineMessages({
  label: {
    id: 'store/subscription.shipping-address.error.action',
    defaultMessage: '',
  },
  noAction: {
    id: 'store/subscription.shipping-address.error.no-action',
    defaultMessage: '',
  },
})

const ShippingCard: FunctionComponent<Props> = ({
  onEdit,
  subscription,
  intl,
}) => (
  <>
    <div className="flex">
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="store/subscription.shipping" />
      </div>
      <div className="ml-auto">
        <EditButton
          subscriptionStatus={subscription.status}
          onEdit={onEdit}
          testId="edit-address-button"
        />
      </div>
    </div>
    <div className="flex pt3-s pt5-ns w-100">
      {subscription.shippingAddress ? (
        <div className="w-100">
          <LabeledInfo label={intl.formatMessage(messages.label)}>
            <AddressRules
              country={subscription.shippingAddress.country}
              shouldUseIOFetching
            >
              <AddressSummary address={subscription.shippingAddress} />
            </AddressRules>
          </LabeledInfo>
        </div>
      ) : (
        <EditAlert
          subscriptionStatus={subscription.status}
          onAction={onEdit}
          actionLabelMessage={intl.formatMessage(messages.label)}
          noActionMessage={intl.formatMessage(messages.noAction)}
        >
          <FormattedMessage id="store/subscription.shipping-address.error.message" />
        </EditAlert>
      )}
    </div>
  </>
)

interface Props extends WrappedComponentProps {
  subscription: Subscription
  onEdit: () => void
}

export default injectIntl(ShippingCard)
