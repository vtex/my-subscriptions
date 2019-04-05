import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum, CSS } from '../../../../constants'
import PaymentDisplay from '../PaymentDisplay'

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

  const displayEdit =
    subscriptionsGroup.status === SubscriptionStatusEnum.Active

  return (
    <div className={CSS.detailCardWrapper}>
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
      <div className="flex pt3-s pt0-ns w-100 mr-auto flex-row-ns flex-column-s">
        <div className="f5-ns f6-s pt5 lh-solid dib-ns c-on-base">
          <PaymentDisplay
            purchaseSettings={subscriptionsGroup.purchaseSettings}
          />
        </div>
        {/* {subscriptionsGroup.purchaseSettings.paymentMethod
          .paymentSystemGroup === 'bankInvoice' &&
          bankInvoiceUrl && (
            <div className="pl9-ns pt2-ns pt6-s">
              <Button
                block
                size="small"
                onClick={() => handleInvoiceButtonClick(bankInvoiceUrl)}
                variation="secondary">
                <FormattedMessage id="subscription.payment.invoice" />
              </Button>
            </div>
          )} */}
      </div>
    </div>
  )
}

// function handleInvoiceButtonClick(bankInvoiceUrl: string) {
//   window.open(bankInvoiceUrl, '_blank')
// }

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
  onEdit: () => void
  onMakeRetry: () => void
  displayRetry: boolean
  isRetryButtonEnabled: boolean
}

export default SubscriptionsGroupPaymentCard
