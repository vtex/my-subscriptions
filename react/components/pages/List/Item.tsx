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
  const images = item.subscriptions.map(
    subscription => subscription.sku.imageUrl
  )

  return (
    <article className={css.subscriptionGroupItemWrapper}>
      <Images images={images} />
      <Summary item={item} onGoToDetails={onGoToDetails} />
    </article>
  )
}

export default SubscriptionGroupItem
