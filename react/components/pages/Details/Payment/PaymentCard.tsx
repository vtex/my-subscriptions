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
}) => {
  // TODO: Check if Boleto is working
  // const lastGeneratedOrder = subscriptionsGroup.lastInstance
  // const bankInvoiceUrl =
  //   lastGeneratedOrder &&
  //   lastGeneratedOrder.orderInfo &&
  //   lastGeneratedOrder.orderInfo.paymentUrl
  console.log(subscriptionsGroup)
  const displayEdit =
    subscriptionsGroup.status === SubscriptionStatusEnum.Active

  return (
    <div className={CSS.cardWrapper}>
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
              disabled={!isRetryButtonEnabled}>
              <FormattedMessage id="subscription.retry.button.message" />
            </Button>
          )}
          {displayEdit && (
            <div className="ml3">
              <Button size="small" variation="tertiary" onClick={onEdit}>
                <FormattedMessage id="subscription.actions.edit" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="flex pt3-s pt0-ns w-100 mr-auto flex-row-ns flex-column-s">
      <div className="f5-ns f6-s pt5 lh-solid dib-ns c-on-base">
        {subscriptionsGroup.purchaseSettings.paymentMethod ? (
          <PaymentDisplay
            paymentMethod={subscriptionsGroup.purchaseSettings.paymentMethod}
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
