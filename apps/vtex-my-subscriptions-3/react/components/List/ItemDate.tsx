import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const messages = defineMessages({
  nextPurchase: {
    id: 'subscription.list.item.date.next.purchase',
  },
  since: {
    id: 'subscription.list.item.date.since',
  },
  paused: {
    id: 'subscription.status.paused',
  },
  canceled: {
    id: 'subscription.status.canceled',
  },
})

const SubscriptionsItemDate: FunctionComponent<
  Props & WrappedComponentProps
> = ({ status, nextPurchaseDate, lastUpdate, intl }) => {
  const content =
    status === 'ACTIVE'
      ? intl.formatMessage(messages.nextPurchase, {
          date: intl.formatDate(nextPurchaseDate),
        })
      : intl.formatMessage(messages.since, {
          date: intl.formatDate(lastUpdate),
          status: intl.formatMessage({
            id: `subscription.status.${status.toLowerCase()}`,
          }),
        })

  return <span className="t-small c-muted-2">{content}</span>
}

interface Props {
  status: SubscriptionStatus
  nextPurchaseDate: string
  lastUpdate: string
}

export default injectIntl(SubscriptionsItemDate)
