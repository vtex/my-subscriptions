import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

interface Props {
  subscriptionGroup: SubscriptionsGroupItemType
}

const SubscriptionName: FunctionComponent<Props & InjectedIntlProps> = ({
  subscriptionGroup: { name, subscriptions },
  intl,
}) => {
  let content
  if (name) {
    content = name
  } else {
    if (subscriptions.length === 1) {
      content = (
        <a
          className="no-underline c-on-base ttc"
          target="_blank"
          href={subscriptions[0].sku.detailUrl}>
          {`${subscriptions[0].sku.productName} - ${subscriptions[0].sku.name}`}
        </a>
      )
    } else {
      content = intl.formatMessage(
        { id: 'subscription.view.title' },
        { value: subscriptions.length }
      )
    }
  }

  return <div className="t-heading-4">{content}</div>
}

export default injectIntl(SubscriptionName)
