import React, { FunctionComponent } from 'react'

import css from '../../../constants/css'
import Images from './Images'
import Summary from './Summary'

interface Props {
  item: SubscriptionsGroupItemType
}

const SubscriptionGroupItem: FunctionComponent<Props> = ({ item }) => {
  const images = item.subscriptions.map(
    subscription => subscription.sku.imageUrl
  )

  return (
    <article className={css.subscriptionGroupItemWrapper}>
      <Images images={images} />
      <Summary item={item} />
    </article>
  )
}

export default SubscriptionGroupItem
