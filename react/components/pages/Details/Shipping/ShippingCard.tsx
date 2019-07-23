import React, { FunctionComponent } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  defineMessages,
} from 'react-intl'
import { AddressRules, AddressSummary } from 'vtex.address-form'
import { Button, Alert } from 'vtex.styleguide'

import { SubscriptionStatusEnum, CSS } from '../../../../constants'
import LabeledInfo from '../../../commons/LabeledInfo'

const messages = defineMessages({
  label: {
    id: 'subscription.shipping.address',
    defaultMessage: '',
  },
  action: {
    id: 'subscription.shipping-address.error.action',
    defaultMessage: '',
  },
})

const ShippingCard: FunctionComponent<InjectedIntlProps & Props> = ({
  onEdit,
  intl,
  subscriptionsGroup,
}) => {
  const displayEdit =
    subscriptionsGroup.status === SubscriptionStatusEnum.Active

  return (
    <div className={CSS.cardWrapper}>
      <div className="flex flex-row">
        <div className="db-s di-ns b f4 tl c-on-base">
          <FormattedMessage id="subscription.shipping" />
        </div>
        <div className="ml-auto">
          {displayEdit && (
            <Button size="small" variation="tertiary" onClick={onEdit}>
              <FormattedMessage id="subscription.actions.edit" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex pt3-s pt5-ns w-100">
        {subscriptionsGroup.shippingAddress ? (
          <div className="w-100">
            <LabeledInfo labelId={messages.label.id}>
              <AddressRules
                country={subscriptionsGroup.shippingAddress.country}
                shouldUseIOFetching
              >
                <AddressSummary address={subscriptionsGroup.shippingAddress} />
              </AddressRules>
            </LabeledInfo>
          </div>
        ) : (
          <Alert
            type="error"
            action={{
              label: intl.formatMessage(messages.action),
              onClick: () => onEdit(),
            }}
          >
            <FormattedMessage id="subscription.shipping-address.error.message" />
          </Alert>
        )}
      </div>
    </div>
  )
}

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
  onEdit: () => void
}

export default injectIntl(ShippingCard)
