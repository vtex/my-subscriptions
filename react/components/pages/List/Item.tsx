import React, { FunctionComponent } from 'react'

import css from '../../../constants/css'
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
    <article className={css.subscriptionGroupItemWrapper}>
      <Images skus={skus} />
      <Summary item={item} onGoToDetails={onGoToDetails} />
    </article>
  )
}

export default SubscriptionGroupItem
