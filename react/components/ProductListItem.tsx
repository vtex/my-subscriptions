import React, { PureComponent } from 'react'
import { FormattedNumber } from 'react-intl'
import { IconDelete } from 'vtex.styleguide'

import QuantitySelector from './QuantitySelector'
import Thumbnail from './SkuThumbnail'

// eslint-disable-next-line react/prefer-stateless-function
class ProductListItem extends PureComponent<Props> {
  public render() {
    const {
      imageUrl,
      name,
      quantity,
      price,
      currency,
      measurementUnit,
      isEditing,
      canRemove,
      onChange,
      onRemove,
      unitMultiplier,
      brandName,
    } = this.props

    return (
      <Thumbnail
        imageUrl={imageUrl}
        name={name}
        brandName={brandName}
        measurementUnit={measurementUnit}
        unitMultiplier={unitMultiplier}
      >
        {isEditing && onChange ? (
          <QuantitySelector
            id="product-list"
            value={quantity}
            onChange={onChange}
          />
        ) : (
          <span className="mv4 mv0-l">{`${quantity} ${measurementUnit}.`}</span>
        )}
        {price && (
          <span className="mv4 mv0-l">
            <FormattedNumber
              currency={currency}
              style="currency"
              value={price * quantity}
            />
          </span>
        )}
        {isEditing && canRemove && (
          <div className="flex">
            <button
              className="c-danger pointer bn bg-transparent"
              onClick={onRemove}
            >
              <IconDelete />
            </button>
          </div>
        )}
      </Thumbnail>
    )
  }
}

interface Props {
  imageUrl: string
  name: string
  brandName: string
  quantity: number
  price?: number | null
  currency: string
  measurementUnit: string
  unitMultiplier: number
  isEditing: boolean
  canRemove: boolean
  onRemove?: () => void
  onChange?: (quantity: number) => void
}

export default ProductListItem
