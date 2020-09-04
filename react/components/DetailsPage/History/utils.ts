import { defineMessages, WrappedComponentProps } from 'react-intl'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

defineMessages({
  triggered: {
    id: 'store/subscription.execution.status.TRIGGERED',
  },
  inProcess: {
    id: 'store/subscription.execution.status.IN_PROCESS',
  },
  failure: {
    id: 'store/subscription.execution.status.FAILURE',
  },
  orderError: {
    id: 'store/subscription.execution.status.ORDER_ERROR',
  },
  success: {
    id: 'store/subscription.execution.status.SUCCESS',
  },
  expired: {
    id: 'store/subscription.execution.status.EXPIRED',
  },
  paymentError: {
    id: 'store/subscription.execution.status.PAYMENT_ERROR',
  },
  skipped: {
    id: 'store/subscription.execution.status.SKIPED',
  },
  noOrder: {
    id: 'store/subscription.execution.status.SUCCESS_WITH_NO_ORDER',
  },
  partial: {
    id: 'store/subscription.execution.status.SUCCESS_WITH_PARTIAL_ORDER',
  },
  reTriggered: {
    id: 'store/subscription.execution.status.RE_TRIGGERED',
  },
  scheduleUpdate: {
    id: 'store/subscription.execution.status.SCHEDULE_UPDATED',
  },
})

export function displayOrderStatus({
  intl,
  status,
}: {
  status: SubscriptionExecutionStatus
} & WrappedComponentProps) {
  return intl.formatMessage({
    id: `store/subscription.execution.status.${status}`,
  })
}
