import React, { FunctionComponent, useState } from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'

import Image from '../ProductImage'
import { AddItemArgs } from '.'
import Button from '../SubscribeButton'
import { subscribed, subscribable } from '../SubscribeButton/utils'
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

  return (
    <article className="flex">
      <Image
        imageUrl={imageUrl}
        productName={name}
        width={64}
        height={64}
        isFixed
      />
      <div className="w-100 flex flex-column flex-row-l justify-between pl4">
        <div className="w-40-l w-100 mb0-l mb2">
          <div className="c-muted-1 fw5 ttu f7 mb2">{brand}</div>
          <div className="mb4 fw5">{name}</div>
          <div className="t-small c-muted-1">
            {`${unitMultiplier} ${measurementUnit}`}
          </div>
        </div>
        <div className="w-60-l w-100 flex flex-column flex-row-l items-center-l justify-between-l">
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
        </div>
      </div>
    </article>
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
