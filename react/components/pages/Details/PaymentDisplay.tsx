import React, { Fragment, FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import PaymentFlagIcon from '../../commons/PaymentFlagIcon'

const PaymentDisplay: FunctionComponent<Props> = ({ paymentMethod, intl }) => {
  return paymentMethod.paymentAccount ? (
    <Fragment>
      <PaymentFlagIcon
        group={paymentMethod.paymentSystemGroup}
        type={paymentMethod.paymentSystemName}
        size={400}
      />
      <span className="fw3 f5-ns f6-s">
        {`${intl.formatMessage({
          id: 'subscription.payment.final',
        })} ${paymentMethod.paymentAccount.cardNumber.slice(-4)}`}
      </span>
    </Fragment>
  ) : (
    <span className="fw3 f5-ns f6-s">
      {intl.formatMessage({
        id: `paymentData.paymentGroup.${paymentMethod.paymentSystemGroup}.name`,
      })}
    </span>
  )
}

interface Props extends InjectedIntlProps {
  paymentMethod: PaymentMethod
}

export default injectIntl(PaymentDisplay)
