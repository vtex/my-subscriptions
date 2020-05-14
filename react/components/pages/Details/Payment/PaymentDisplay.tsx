import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { PaymentFlag, utils } from 'vtex.payment-flags'
import { PaymentMethod } from 'vtex.subscriptions-graphql'

const PaymentDisplay: FunctionComponent<Props> = ({
  paymentMethod: {
    paymentSystemId,
    paymentSystemGroup,
    paymentSystemName,
    paymentAccount,
  },
  intl,
}) => (
  <div className="flex">
    <div className="h2">
      <PaymentFlag paymentSystemId={paymentSystemId} />
    </div>
    <span className="t-body pl4 flex items-center">
      {utils.displayPayment({
        intl,
        paymentSystemGroup,
        paymentSystemName,
        lastDigits: paymentAccount?.cardNumber.slice(-4),
      })}
    </span>
  </div>
)

interface Props extends InjectedIntlProps {
  paymentMethod: PaymentMethod
}

export default injectIntl(PaymentDisplay)
