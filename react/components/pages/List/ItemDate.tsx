import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import { SubscriptionStatusEnum } from '../../../enums'

interface Props {
  item: SubscriptionsGroupItemType
}

const SubscriptionsGroupItemDate: FunctionComponent<
  Props & InjectedIntlProps
> = ({ item, intl }) => {
  const content =
    item.status === SubscriptionStatusEnum.Active
      ? intl.formatMessage(
          { id: 'subscription.list.item.date.next.purchase' },
          {
            date: '10/10/10',
          }
        )
      : intl.formatMessage(
          { id: 'subscription.list.item.date.since' },
          {
            date: '10/10/10',
            status: intl.formatMessage({
              id: `subscription.status.${item.status.toLowerCase()}`,
            }),
          }
        )

  return <span className="t-body c-muted-2">{content}</span>
}

export default injectIntl(SubscriptionsGroupItemDate)
