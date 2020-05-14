import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const SubscriptionsGroupItemDate: FunctionComponent<
  Props & WrappedComponentProps
> = ({ status, nextPurchaseDate, lastUpdate, intl }) => {
  const content =
    status === 'ACTIVE'
      ? intl.formatMessage(
          { id: 'subscription.list.item.date.next.purchase' },
          {
            date: intl.formatDate(nextPurchaseDate),
          }
        )
      : intl.formatMessage(
          { id: 'subscription.list.item.date.since' },
          {
            date: intl.formatDate(lastUpdate),
            status: intl.formatMessage({
              id: `subscription.status.${status.toLowerCase()}`,
            }),
          }
        )

  return <span className="t-small c-muted-2">{content}</span>
}

interface Props {
  status: SubscriptionStatus
  nextPurchaseDate: string
  lastUpdate: string
}

export default injectIntl(SubscriptionsGroupItemDate)
