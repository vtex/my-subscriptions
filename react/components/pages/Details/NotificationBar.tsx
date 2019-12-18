import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { Box, Button } from 'vtex.styleguide'

import { SubscriptionState } from '../../../constants'
import { retrieveSubscriptionState } from '../../../utils'
import { SubscriptionsGroup } from '.'

const messages = defineMessages({
  pausedTitle: {
    id: 'a',
    defaultMessage: 'Subscription paused',
  },
  pausedBody: {
    id: 'a',
    defaultMessage: 'You can resume anytime',
  },
  pausedAction: {
    id: 'a',
    defaultMessage: 'You can resume anytime',
  },
  skipTitle: {
    id: 'a',
    defaultMessage: 'Skip next order',
  },
  skipBody: {
    id: 'a',
    defaultMessage: 'Your {date} order will be skipped',
  },
  skipAction: {
    id: 'a',
    defaultMessage: 'Cancel skip',
  },
  canceledTitle: {
    id: 'a',
    defaultMessage: 'Subscription canceled',
  },
  canceledBody: {
    id: 'a',
    defaultMessage: 'You can restart anytime',
  },
  canceledAction: {
    id: 'a',
    defaultMessage: 'Restart Subscription',
  },
  invalidAdressAction: {
    id: 'a',
    defaultMessage: 'Change Address',
  },
  invalidAdressTitle: {
    id: 'a',
    defaultMessage: 'Invalid address',
  },
  invalidAdressBody: {
    id: 'a',
    defaultMessage: 'Please, check your shipping address',
  },
  invalidPaymentAction: {
    id: 'a',
    defaultMessage: 'Change Payment Method',
  },
  invalidPaymentTitle: {
    id: 'a',
    defaultMessage: 'Invalid payment',
  },
  invalidPaymentBody: {
    id: 'a',
    defaultMessage: 'Please, check your payment method',
  },
  nextDeliveryAction: {
    id: 'a',
    defaultMessage: 'See Details',
  },
  nextDeliveryTitle: {
    id: 'a',
    defaultMessage: 'Next delivery',
  },
})

function retrieveContent(option: SubscriptionState, props: Props) {
  const {
    intl: { formatMessage, formatDate },
  } = props

  switch (option) {
    case SubscriptionState.Paused:
      return {
        title: formatMessage(messages.pausedTitle),
        body: formatMessage(messages.pausedBody),
        actions: <Button>{formatMessage(messages.pausedAction)}</Button>,
      }
    case SubscriptionState.Canceled:
      return {
        title: formatMessage(messages.canceledTitle),
        body: formatMessage(messages.canceledBody),
        actions: <Button>{formatMessage(messages.canceledAction)}</Button>,
      }
    case SubscriptionState.Skipped:
      return {
        title: formatMessage(messages.skipTitle),
        body: formatMessage(messages.skipBody),
        actions: (
          <Button variation="secondary">
            {formatMessage(messages.skipAction)}
          </Button>
        ),
      }
    case SubscriptionState.InvalidAddress:
      return {
        title: formatMessage(messages.invalidAdressTitle),
        body: formatMessage(messages.invalidAdressBody),
        actions: (
          <Button> {formatMessage(messages.invalidAdressAction)}</Button>
        ),
      }
    case SubscriptionState.InvalidPayment:
      return {
        title: formatMessage(messages.invalidPaymentTitle),
        body: formatMessage(messages.invalidPaymentBody),
        actions: (
          <Button> {formatMessage(messages.invalidPaymentAction)}</Button>
        ),
      }
    case SubscriptionState.PaymentError:
      return {
        title: 'a',
        body: '',
        actions: null,
      }
    default:
      return {
        title: formatMessage(messages.nextDeliveryTitle),
        body: formatDate(props.group.shippingEstimate?.estimatedDeliveryDate, {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          timeZone: 'UTC',
        }),
        actions: <Button>{formatMessage(messages.nextDeliveryAction)}</Button>,
      }
  }
}

const NotificationBar: FunctionComponent<Props> = props => {
  const { group } = props

  const option = retrieveSubscriptionState(group)

  const content = retrieveContent(option, props)

  const danger =
    option === SubscriptionState.InvalidAddress ||
    option === SubscriptionState.InvalidPayment

  return (
    <Box>
      <span className={danger ? 'c-danger' : 'c-muted-1'}>{content.title}</span>
      <div className="flex justify-between flex-wrap">
        <span className="t-heading-4 flex items-center">{content.body}</span>
        <div className="w-auto-l w-100 flex items-center pt0-l pt4">
          {content.actions}
        </div>
      </div>
    </Box>
  )
}

interface Props extends InjectedIntlProps {
  group: SubscriptionsGroup
}

export default injectIntl(NotificationBar)
