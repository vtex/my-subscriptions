import React, { FunctionComponent, useState } from 'react'
import { FormattedNumber } from 'react-intl'
import { NumericStepper, Button } from 'vtex.styleguide'

import Image from '../../ProductImage'

const SearchItem: FunctionComponent<Props> = ({
  imageUrl,
  name,
  price,
  currency,
  measurementUnit,
  unitMultiplier,
  brand,
  disabled,
}) => {
  const [quantity, setQuantity] = useState(1)

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
        <div className="w-60-l w-100 flex items-center justify-between">
          <NumericStepper
            label={
              <FormattedNumber
                currency={currency}
                style="currency"
                value={price * quantity}
              />
            }
            minValue={1}
            size="small"
            value={quantity}
            readOnly={disabled}
            onChange={(event: { value: number }) => setQuantity(event.value)}
          />
          <Button variation="tertiary" disabled={disabled}>
            Adicionar
          </Button>
        </div>
      </div>
    </article>
  )
}

interface Props {
  imageUrl: string
  name: string
  price: number
  currency: string
  measurementUnit: string
  unitMultiplier: number
  brand: string
  disabled: boolean
}

export default SearchItem
