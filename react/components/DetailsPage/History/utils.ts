import { defineMessages, WrappedComponentProps } from 'react-intl'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

defineMessages({
  triggered: {
    id: 'subscription.execution.status.TRIGGERED',
  },
  inProcess: {
    id: 'subscription.execution.status.IN_PROCESS',
  },
  failure: {
    id: 'subscription.execution.status.FAILURE',
  },
  orderError: {
    id: 'subscription.execution.status.ORDER_ERROR',
  },
  success: {
    id: 'subscription.execution.status.SUCCESS',
  },
  expired: {
    id: 'subscription.execution.status.EXPIRED',
  },
  paymentError: {
    id: 'subscription.execution.status.PAYMENT_ERROR',
  },
  skipped: {
    id: 'subscription.execution.status.SKIPED',
  },
  noOrder: {
    id: 'subscription.execution.status.SUCCESS_WITH_NO_ORDER',
  },
  partial: {
    id: 'subscription.execution.status.SUCCESS_WITH_PARTIAL_ORDER',
  },
  reTriggered: {
    id: 'subscription.execution.status.RE_TRIGGERED',
  },
  scheduleUpdate: {
    id: 'subscription.execution.status.SCHEDULE_UPDATED',
  },
})

export function displayOrderStatus({
  intl,
  status,
}: {
  status: SubscriptionExecutionStatus
} & WrappedComponentProps) {
  return intl.formatMessage({
    id: `subscription.execution.status.${status}`,
  })
}
