import { defineMessages, InjectedIntlProps } from 'react-intl'

import { SubscriptionOrderStatus } from '../../../../constants'

defineMessages({
  triggered: {
    id: 'store/subscription.order.status.TRIGGERED',
    defaultMessage: '',
  },
  inProcess: {
    id: 'store/subscription.order.status.IN_PROCESS',
    defaultMessage: '',
  },
  failure: {
    id: 'store/subscription.order.status.FAILURE',
    defaultMessage: '',
  },
  orderError: {
    id: 'store/subscription.order.status.ORDER_ERROR',
    defaultMessage: '',
  },
  success: {
    id: 'store/subscription.order.status.SUCCESS',
    defaultMessage: '',
  },
  expired: {
    id: 'store/subscription.order.status.EXPIRED',
    defaultMessage: '',
  },
  paymentError: {
    id: 'store/subscription.order.status.PAYMENT_ERROR',
    defaultMessage: '',
  },
  skipped: { id: 'store/subscription.order.status.SKIPED', defaultMessage: '' },
  noOrder: {
    id: 'store/subscription.order.status.SUCCESS_WITH_NO_ORDER',
    defaultMessage: '',
  },
  partial: {
    id: 'store/subscription.order.status.SUCCESS_WITH_PARTIAL_ORDER',
    defaultMessage: '',
  },
  reTriggered: {
    id: 'store/subscription.order.status.RE_TRIGGERED',
    defaultMessage: '',
  },
})

export function displayOrderStatus({
  intl,
  status,
}: {
  status: SubscriptionOrderStatus
} & InjectedIntlProps) {
  return intl.formatMessage({ id: `store/subscription.order.status.${status}` })
}
