import React, { FunctionComponent } from 'react'

import Image from '../../../commons/ProductImage'
import Price from '../../../commons/FormattedPrice'

const ProductListItem: FunctionComponent<Props> = ({
  imageUrl,
  name,
  description,
  quantity,
  price,
  currency,
  measurementUnit,
}) => {
  return (
    <article className="flex">
      <Image
        imageUrl={imageUrl}
        productName={name}
        widthSize={100}
        heightSize={100}
      />
      <div className="w-100 flex flex-column flex-row-m t-body justify-between pl4">
        <div className="w-60-l w-100 flex items-center">
          <div>
            <span className="db mb4 b">{name}</span>
            <span className="t-small c-muted-2">{description}</span>
          </div>
        </div>
        <div className="w-20-l w-100 flex items-center">
          {quantity} {measurementUnit}. &nbsp;
        </div>
        <div className="w-20-l w-100 flex items-center justify-end">
          <span className="b ph5">
            <Price value={price} currency={currency} />
          </span>
        </div>
      </div>
    </article>
  )
}

interface Props {
  imageUrl: string
  name: string
  description: string
  quantity: number
  price: number
  currency: string
  measurementUnit: string
}

export default ProductListItem
