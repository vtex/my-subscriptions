import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

import { SubscriptionStatus } from '../../constants'

const messages = defineMessages({
  nextPurchase: {
    id: 'store/subscription.list.item.date.next.purchase',
    defaultMessage: '',
  },
  since: {
    id: 'store/subscription.list.item.date.since',
    defaultMessage: '',
  },
  paused: {
    id: 'store/subscription.status.paused',
    defaultMessage: '',
  },
  canceled: {
    id: 'store/subscription.status.canceled',
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
