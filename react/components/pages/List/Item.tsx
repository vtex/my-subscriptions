import React, { FunctionComponent } from 'react'

import { CSS } from '../../../constants'
import Images from './Images'
import Summary from './Summary'

interface Props {
  item: SubscriptionsGroupItemType
  onGoToDetails: (orderGroup: string) => void
}

const SubscriptionGroupItem: FunctionComponent<Props> = ({
  item,
  onGoToDetails,
}) => {
  const skus = item.subscriptions.map(subscription => subscription.sku)

  return (
    <article className={CSS.subscriptionGroupItemWrapper}>
      <Images skus={skus} />
      <Summary item={item} onGoToDetails={onGoToDetails} />
    </article>
  )
}

export default SubscriptionGroupItem
