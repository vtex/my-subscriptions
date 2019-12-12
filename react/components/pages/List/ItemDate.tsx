import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { SubscriptionStatus } from '../../../constants'

const SubscriptionsGroupItemDate: FunctionComponent<Props &
  InjectedIntlProps> = ({
  status,
  nextPurchaseDate,
  lastStatusUpdate,
  intl,
}) => {
  const content =
    status === SubscriptionStatus.Active
      ? intl.formatMessage(
          { id: 'subscription.list.item.date.next.purchase' },
          {
            date: intl.formatDate(nextPurchaseDate),
          }
        )
      : intl.formatMessage(
          { id: 'subscription.list.item.date.since' },
          {
            date: intl.formatDate(lastStatusUpdate),
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
  lastStatusUpdate: string
}

export default injectIntl(SubscriptionsGroupItemDate)
