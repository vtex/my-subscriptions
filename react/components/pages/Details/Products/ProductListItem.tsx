import React, { PureComponent } from 'react'
import { NumericStepper, IconDelete } from 'vtex.styleguide'

import Image from '../../../commons/ProductImage'
import Price from '../../../commons/FormattedPrice'

class ProductListItem extends PureComponent<Props> {
  public render() {
    const {
      imageUrl,
      name,
      description,
      quantity,
      price,
      currency,
      measurementUnit,
      isEditing,
      onChange,
      onRemove,
    } = this.props

    return (
      <article className="flex">
        <Image
          imageUrl={imageUrl}
          productName={name}
          widthSize={100}
          heightSize={100}
          isFixed
        />
        <div className="w-100 flex flex-column flex-row-m t-body justify-between pl4">
          <div className="w-60-l w-100 flex items-center">
            <div>
              <span className="db mb4 b">{name}</span>
              <span className="t-small c-muted-2">{description}</span>
            </div>
          </div>
          <div className="w-20-l w-100 flex items-center pv3 ph3-m">
            {isEditing ? (
              <NumericStepper
                minValue={1}
                value={quantity}
                onChange={(event: { value: number }) =>
                  onChange && onChange(event.value)
                }
              />
            ) : (
              <span>
                {quantity} {measurementUnit}. &nbsp;
              </span>
            )}
          </div>
          <div className="w-20-l w-100 flex items-center justify-end-m">
            <span className="b ph5-m">
              <Price value={price * quantity} currency={currency} />
            </span>
          </div>
        </div>
        {isEditing && (
          <div className="flex-m">
            <button className="c-danger pointer bn-l" onClick={onRemove}>
              <IconDelete />
            </button>
          </div>
        )}
      </article>
    )
  }
}

interface Props {
  imageUrl: string
  name: string
  description: string
  quantity: number
  price: number
  currency: string
  measurementUnit: string
  isEditing: boolean
  onRemove?: () => void
  onChange?: (quantity: number) => void
}

export default ProductListItem
