import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'

import { Product } from '.'
import AddItemModal, { OnAddItemArgs } from '../AddItemModal'
import ProductListItem from '../ProductListItem'

const Products: FunctionComponent<Props> = ({
  currentPlan,
  currency,
  products,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
}) => (
  <Box
    title={
      <FormattedMessage
        id="store/creation-page.products-card.title"
        defaultMessage="Products"
      />
    }
  >
    <div className="mb7">
      <AddItemModal
        targetPlan={currentPlan}
        currency={currency}
        subscribedSkus={products.map((product) => product.skuId)}
        onAddItem={onAddItem}
      />
    </div>
    {products.map((product, i) => (
      <div
        className={i !== products.length - 1 ? 'mb8' : ''}
        key={product.skuId}
      >
        <ProductListItem
          isEditing
          canRemove
          name={product.name}
          quantity={product.quantity}
          imageUrl={product.imageUrl}
          measurementUnit={product.measurementUnit}
          unitMultiplier={product.unitMultiplier}
          brandName={product.brand}
          price={product.price}
          currency={currency}
          onChange={(quantity: number) =>
            onUpdateQuantity({ skuId: product.skuId, quantity })
          }
          onRemove={() => onRemoveItem(product.skuId)}
        />
      </div>
    ))}
  </Box>
)

type Props = {
  products: Product[]
  onAddItem: (args: OnAddItemArgs) => void
  onRemoveItem: (skuId: string) => void
  onUpdateQuantity: (args: { skuId: string; quantity: number }) => void
  currentPlan: string | null
  currency: string
}

export default Products
