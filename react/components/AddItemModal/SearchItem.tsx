import React, { FunctionComponent, useState } from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'

import Thumbnail from '../SkuThumbnail'
import { AddItemArgs } from '.'
import Button from './SubscribeButton'
import { subscribed, subscribable } from './SubscribeButton/utils'
import QuantitySelector from '../QuantitySelector'

const SearchItem: FunctionComponent<Props> = ({
  imageUrl,
  name,
  price,
  currency,
  measurementUnit,
  unitMultiplier,
  brand,
  onAddItem,
  subscribedSkus,
  targetPlan,
  availablePlans,
  id,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const canAdd = subscribable({ targetPlan, availablePlans })

  return (
    <Thumbnail
      imageUrl={imageUrl}
      name={name}
      brandName={brand}
      measurementUnit={measurementUnit}
      unitMultiplier={unitMultiplier}
    >
      {canAdd && (
        <>
          <QuantitySelector
            id="search-modal"
            value={quantity}
            onChange={setQuantity}
            disabled={
              subscribed({ skuId: id, subscribedSkus }) ||
              !subscribable({ targetPlan, availablePlans })
            }
          />
          <span className="mv4 mv0-l">
            <FormattedNumber
              currency={currency}
              style="currency"
              value={price * quantity}
            />
          </span>
        </>
      )}
      <Button
        skuId={id}
        availablePlans={availablePlans}
        targetPlan={targetPlan}
        subscribedSkus={subscribedSkus}
        buttonType="plain"
        isLoading={loading}
        onClick={() => onAddItem({ skuId: id, quantity, setLoading })}
      >
        <FormattedMessage id="store/add-item-modal.subscribe" />
      </Button>
    </Thumbnail>
  )
}

interface Props {
  id: string
  imageUrl: string
  name: string
  price: number
  currency: string
  measurementUnit: string
  unitMultiplier: number
  brand: string
  onAddItem: (args: AddItemArgs) => void
  subscribedSkus: string[]
  availablePlans: string[]
  targetPlan: string
}

export default SearchItem