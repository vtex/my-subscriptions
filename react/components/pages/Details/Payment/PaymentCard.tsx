import React, { FunctionComponent } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { CSS, PAYMENT_DIV_ID, TagTypeEnum } from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import EditAlert from '../../../commons/EditAlert'
import EditButton from '../../../commons/EditButton'
import PaymentDisplay from '../PaymentDisplay'

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
  subscriptionsGroup,
  onEdit,
  onMakeRetry,
  displayRetry,
  isRetryButtonEnabled,
}) => (
  <div className={CSS.cardWrapper} id={PAYMENT_DIV_ID}>
    <Alert
      visible={displayRetry}
      type={TagTypeEnum.Warning}
      contentId="subscription.payment.alert.info.message"
      onClose={() => null}
    />
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
            subscriptionStatus={subscriptionsGroup.status}
          />
        </div>
      </div>
    </div>
    <div className="flex pt3-s pt0-ns w-100 mr-auto flex-row-ns flex-column-s">
      <div className="f5-ns f6-s pt5 lh-solid dib-ns c-on-base">
        {subscriptionsGroup.purchaseSettings ? (
          <PaymentDisplay
            purchaseSettings={subscriptionsGroup.purchaseSettings}
          />
        ) : (
          <EditAlert
            subscriptionStatus={subscriptionsGroup.status}
            onAction={onEdit}
            actionLabelMessage={messages.label}
            noActionMessage={messages.noAction}
          >
            <FormattedMessage id="subscription.purchase-settings.error.message" />
          </EditAlert>
        )}
      </div>
    </div>
  </div>
)

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
  onEdit: () => void
  onMakeRetry: () => void
  displayRetry: boolean
  isRetryButtonEnabled: boolean
}

export default SubscriptionsGroupPaymentCard
