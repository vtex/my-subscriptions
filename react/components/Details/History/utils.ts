import { defineMessages, InjectedIntlProps } from 'react-intl'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

defineMessages({
  triggered: {
    id: 'store/subscription.execution.status.TRIGGERED',
    defaultMessage: '',
  },
  inProcess: {
    id: 'store/subscription.execution.status.IN_PROCESS',
    defaultMessage: '',
  },
  failure: {
    id: 'store/subscription.execution.status.FAILURE',
    defaultMessage: '',
  },
  orderError: {
    id: 'store/subscription.execution.status.ORDER_ERROR',
    defaultMessage: '',
  },
  success: {
    id: 'store/subscription.execution.status.SUCCESS',
    defaultMessage: '',
  },
  expired: {
    id: 'store/subscription.execution.status.EXPIRED',
    defaultMessage: '',
  },
  paymentError: {
    id: 'store/subscription.execution.status.PAYMENT_ERROR',
    defaultMessage: '',
  },
  skipped: {
    id: 'store/subscription.execution.status.SKIPED',
    defaultMessage: '',
  },
  noOrder: {
    id: 'store/subscription.execution.status.SUCCESS_WITH_NO_ORDER',
    defaultMessage: '',
  },
  partial: {
    id: 'store/subscription.execution.status.SUCCESS_WITH_PARTIAL_ORDER',
    defaultMessage: '',
  },
  reTriggered: {
    id: 'store/subscription.execution.status.RE_TRIGGERED',
    defaultMessage: '',
  },
})

export function displayOrderStatus({
  intl,
  status,
}: {
  status: SubscriptionExecutionStatus
} & InjectedIntlProps) {
  return intl.formatMessage({
    id: `store/subscription.execution.status.${status}`,
  })
}
