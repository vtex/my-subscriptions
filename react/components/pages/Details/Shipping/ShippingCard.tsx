import React, { FunctionComponent } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import { AddressRules, AddressSummary } from 'vtex.address-form'

import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import LabeledInfo from '../../../commons/LabeledInfo'
import EditButton from '../../../commons/EditButton'
import EditAlert from '../../../commons/EditAlert'

import { SubscriptionsGroup } from '..'

const messages = defineMessages({
  label: {
    id: 'subscription.shipping-address.error.action',
    defaultMessage: '',
  },
  noAction: {
    id: 'subscription.shipping-address.error.no-action',
    defaultMessage: '',
  },
})

const ShippingCard: FunctionComponent<Props> = ({ onEdit, group }) => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className="flex flex-row">
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="subscription.shipping" />
      </div>
      <div className="ml-auto">
        <EditButton
          subscriptionStatus={group.status}
          onEdit={onEdit}
          testId="edit-address-button"
        />
      </div>
    </div>
    <div className="flex pt3-s pt5-ns w-100">
      {group.shippingAddress ? (
        <div className="w-100">
          <LabeledInfo labelId={messages.label.id}>
            <AddressRules
              country={group.shippingAddress.country}
              shouldUseIOFetching
            >
              <AddressSummary address={group.shippingAddress} />
            </AddressRules>
          </LabeledInfo>
        </div>
      ) : (
        <EditAlert
          subscriptionStatus={group.status}
          onAction={onEdit}
          actionLabelMessage={messages.label}
          noActionMessage={messages.noAction}
        >
          <FormattedMessage id="subscription.shipping-address.error.message" />
        </EditAlert>
      )}
    </div>
  </div>
)

interface Props {
  group: SubscriptionsGroup
  onEdit: () => void
}

export default injectIntl(ShippingCard)
