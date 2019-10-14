import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { PaymentFlag, utils } from 'vtex.payment-flags'

const PaymentDisplay: FunctionComponent<Props> = ({
  paymentMethod: {
    paymentSystem,
    paymentSystemGroup,
    paymentSystemName,
    paymentAccount,
  },
  intl,
}) => (
  <div className="flex">
    <div className="h2">
      <PaymentFlag paymentSystemId={paymentSystem} />
    </div>
    <span className="t-body pl4 flex items-center">
      {utils.displayPayment({
        intl,
        paymentSystemGroup,
        paymentSystemName,
        lastDigits: paymentAccount && paymentAccount.cardNumber.slice(-4),
      })}
    </span>
  </div>
)

interface Props extends InjectedIntlProps {
  paymentMethod: PaymentMethod
}

export default injectIntl(PaymentDisplay)
