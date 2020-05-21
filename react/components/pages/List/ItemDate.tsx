import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

import { SubscriptionStatus } from '../../../constants'

const messages = defineMessages({
  nextPurchase: {
    id: 'subscription.list.item.date.next.purchase',
    defaultMessage: '',
  },
  since: {
    id: 'subscription.list.item.date.since',
    defaultMessage: '',
  },
  paused: {
    id: 'subscription.status.paused',
    defaultMessage: '',
  },
  canceled: {
    id: 'subscription.status.canceled',
    defaultMessage: '',
  },
})

const SubscriptionsGroupItemDate: FunctionComponent<
  Props & InjectedIntlProps
> = ({ status, nextPurchaseDate, lastStatusUpdate, intl }) => {
  const content =
    status === SubscriptionStatus.Active
      ? intl.formatMessage(messages.nextPurchase, {
          date: intl.formatDate(nextPurchaseDate),
        })
      : intl.formatMessage(messages.since, {
          date: intl.formatDate(lastStatusUpdate),
          status: intl.formatMessage({
            id: `subscription.status.${status.toLowerCase()}`,
          }),
        })

  return <span className="t-small c-muted-2">{content}</span>
}

interface Props {
  status: SubscriptionStatus
  nextPurchaseDate: string
  lastStatusUpdate: string
}

export default injectIntl(SubscriptionsGroupItemDate)
