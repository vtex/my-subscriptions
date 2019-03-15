import React, { Fragment, FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import PaymentFlagIcon from '../../commons/PaymentFlagIcon'

const PaymentDisplay: FunctionComponent<Props> = ({
  purchaseSettings,
  intl,
}) => {
  return purchaseSettings.paymentMethod.paymentAccount ? (
    <Fragment>
      <PaymentFlagIcon
        group={purchaseSettings.paymentMethod.paymentSystemGroup}
        type={purchaseSettings.paymentMethod.paymentSystemName}
        size={400}
      />
      <span className="fw3 f5-ns f6-s">
        {`${intl.formatMessage({
          id: 'subscription.payment.final',
        })} ${purchaseSettings.paymentMethod.paymentAccount.cardNumber.slice(
          -4
        )}`}
      </span>
    </Fragment>
  ) : (
    <span className="fw3 f5-ns f6-s">
      {intl.formatMessage({
        id: `paymentData.paymentGroup.${
          purchaseSettings.paymentMethod.paymentSystemGroup
        }.name`,
      })}
    </span>
  )
}

interface Props extends InjectedIntlProps {
  purchaseSettings: PurchaseSettings
}

export default injectIntl(PaymentDisplay)
