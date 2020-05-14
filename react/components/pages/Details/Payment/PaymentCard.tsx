import React, { FunctionComponent } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Button, Alert } from 'vtex.styleguide'

import EditAlert from '../../../commons/EditAlert'
import EditButton from '../../../commons/EditButton'
import PaymentDisplay from './PaymentDisplay'
import { SubscriptionsGroup } from '..'

const messages = defineMessages({
  label: {
    id: 'subscription.purchase-settings.error.action',
    defaultMessage: '',
  },
  noAction: {
    id: 'subscription.purchase-settings.error.no-action',
    defaultMessage: '',
  },
})

const SubscriptionsGroupPaymentCard: FunctionComponent<Props> = ({
  group,
  onEdit,
  onMakeRetry,
  displayRetry,
  isRetryButtonEnabled,
}) => (
  <>
    {displayRetry && (
      <div className="mb5">
        <Alert type="warning">
          <FormattedMessage id="subscription.payment.alert.info.message" />
        </Alert>
      </div>
    )}
    <div className="flex flex-row">
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="subscription.payment" />
      </div>
      <div className="ml-auto flex flex-row">
        {displayRetry && (
          <Button
            size="small"
            variation="secondary"
            onClick={onMakeRetry}
            disabled={!isRetryButtonEnabled}
          >
            <FormattedMessage id="subscription.retry.button.message" />
          </Button>
        )}
        <div className="ml3">
          <EditButton
            onEdit={onEdit}
            subscriptionStatus={group.status}
            testId="edit-payment-button"
          />
        </div>
      </div>
    </div>
    <div className="flex pt3-s pt0-ns w-100 mr-auto flex-row-ns flex-column-s">
      <div className="f5-ns f6-s pt5 lh-solid dib-ns c-on-base">
        {group.purchaseSettings.paymentMethod ? (
          <PaymentDisplay
            paymentMethod={group.purchaseSettings.paymentMethod}
          />
        ) : (
          <EditAlert
            subscriptionStatus={group.status}
            onAction={onEdit}
            actionLabelMessage={messages.label}
            noActionMessage={messages.noAction}
          >
            <FormattedMessage id="subscription.purchase-settings.error.message" />
          </EditAlert>
        )}
      </div>
    </div>
  </>
)

interface Props {
  group: SubscriptionsGroup
  onEdit: () => void
  onMakeRetry: () => void
  displayRetry: boolean
  isRetryButtonEnabled: boolean
}

export default SubscriptionsGroupPaymentCard
