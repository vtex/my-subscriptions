import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { Box, Button } from 'vtex.styleguide'

import { SubscriptionState, UpdateAction } from '../../../constants'
import { retrieveSubscriptionState } from '../../../utils'

import { SubscriptionsGroup } from '.'

//TODO
const messages = defineMessages({
  pausedTitle: {
    id: 'Subscription paused',
    defaultMessage: '',
  },
  pausedBody: {
    id: 'You can resume anytime',
    defaultMessage: '',
  },
  pausedAction: {
    id: 'You can resume anytime',
    defaultMessage: '',
  },
  skipTitle: {
    id: 'Skip next order',
    defaultMessage: '',
  },
  skipBody: {
    id: 'Your {date} order will be skipped',
    defaultMessage: '',
  },
  skipAction: {
    id: 'Cancel skip',
    defaultMessage: '',
  },
  canceledTitle: {
    id: 'Subscription canceled',
    defaultMessage: '',
  },
  canceledBody: {
    id: 'You can restart anytime',
    defaultMessage: '',
  },
  canceledAction: {
    id: 'Restart Subscription',
    defaultMessage: '',
  },
  invalidAdressAction: {
    id: 'Change Address',
    defaultMessage: '',
  },
  invalidAdressTitle: {
    id: 'Invalid address',
    defaultMessage: '',
  },
  invalidAdressBody: {
    id: 'Please, check your shipping address',
    defaultMessage: '',
  },
  invalidPaymentAction: {
    id: 'Change Payment Method',
    defaultMessage: '',
  },
  invalidPaymentTitle: {
    id: 'Invalid payment',
    defaultMessage: '',
  },
  invalidPaymentBody: {
    id: 'Please, check your payment method',
    defaultMessage: '',
  },
  nextDeliveryAction: {
    id: 'See Details',
    defaultMessage: '',
  },
  nextDeliveryTitle: {
    id: 'Next delivery',
    defaultMessage: '',
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
        actions: (
          <Button
            onClick={() => props.onChangeUpdateType(UpdateAction.Restore)}
          >
            {formatMessage(messages.pausedAction)}
          </Button>
        ),
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
          <Button
            variation="secondary"
            onClick={() => props.onChangeUpdateType(UpdateAction.Unskip)}
          >
            {formatMessage(messages.skipAction, {
              date: formatDate(props.group.nextPurchaseDate),
            })}
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
  onChangeUpdateType: (type: UpdateAction) => void
}

export default injectIntl(NotificationBar)
