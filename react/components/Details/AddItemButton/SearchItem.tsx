import React, { PureComponent } from 'react'
import { FormattedNumber } from 'react-intl'

import Image from '../../ProductImage'

// eslint-disable-next-line react/prefer-stateless-function
class SearchItem extends PureComponent<Props> {
  public render() {
    const {
      imageUrl,
      name,
      price,
      currency,
      measurementUnit,
      unitMultiplier,
      brand,
    } = this.props

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
          <div className="w-40-l w-100">
            <div className="c-muted-1 fw5 ttu f7 mb2">{brand}</div>
            <div className="mb4 fw5">{name}</div>
            <div className="t-small c-muted-1">
              {`${unitMultiplier} ${measurementUnit}`}
            </div>
          </div>
          <div className="w-60-l w-100 flex items-center">
            <FormattedNumber
              currency={currency}
              style="currency"
              value={price}
            />
          </div>
        </div>
      </article>
    )
  }
}

interface Props {
  imageUrl: string
  name: string
  price: number
  currency: string
  measurementUnit: string
  unitMultiplier: number
  brand: string
}

export default SearchItem
