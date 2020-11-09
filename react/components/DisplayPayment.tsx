import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { PaymentFlag, utils } from 'vtex.payment-flags'
import {
  PaymentMethod,
  SubscriptionExecutionStatus,
} from 'vtex.subscriptions-graphql'

import Label from './LabeledInfo'
import Error from './CustomErrorAlert'

const messages = defineMessages({
  label: {
    id: 'display-payment.label',
  },
  deletedError: {
    id: 'display-payment.deleted-error-message',
  },
  paymentError: {
    id: 'display-payment.payment-error-message',
  },
})

function getLastDigits(digits: string) {
  return digits.substring(digits.length - 4)
}

const DisplayPayment: FunctionComponent<Props> = ({
  paymentMethod,
  intl,
  lastExecutionStatus,
}) => (
  <Label label={intl.formatMessage(messages.label)}>
    {paymentMethod ? (
      <div className="flex">
        <div className="h2">
          <PaymentFlag paymentSystemId={paymentMethod.paymentSystemId} />
        </div>
        <span className="t-body pl4 flex items-center">
          {utils.displayPayment({
            intl,
            paymentSystemGroup: paymentMethod.paymentSystemGroup,
            paymentSystemName: paymentMethod.paymentSystemName,
            lastDigits:
              paymentMethod.paymentAccount &&
              getLastDigits(paymentMethod.paymentAccount?.cardNumber),
          })}
        </span>
      </div>
    ) : (
      <Error>{intl.formatMessage(messages.deletedError)}</Error>
    )}
    {lastExecutionStatus === 'PAYMENT_ERROR' && (
      <div className="mt4">
        <Error>{intl.formatMessage(messages.paymentError)}</Error>
      </div>
    )}
  </Label>
)

interface Props extends WrappedComponentProps {
  paymentMethod: PaymentMethod | null
  lastExecutionStatus?: SubscriptionExecutionStatus
}

export default injectIntl(DisplayPayment)
