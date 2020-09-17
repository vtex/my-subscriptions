import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import EditButton from '../../EditButton'
import EditionButtons from '../EditionButtons'
import ProductListItem from '../../ProductListItem'
import { Item } from '../../../graphql/queries/detailsPage.gql'
import AddItemModal, { OnAddItemArgs } from '../../AddItemModal'

const ProductsListing: FunctionComponent<Props> = ({
  status,
  products,
  currency,
  isEditing,
  isLoading,
  canRemove,
  onSave,
  onCancel,
  onGoToEdition,
  onUpdateQuantity,
  onRemoveSubscription,
  currentPlan,
  onAddItem,
}) => (
  <Box
    title={
      <div className="flex flex-wrap justify-between items-center min-h-small">
        <FormattedMessage id="store/subscription.products.card.title" />
        {!isEditing && status === 'ACTIVE' && (
          <EditButton onClick={onGoToEdition} withBackground />
        )}
        {isEditing && (
          <div className="mt4 mt0-l">
            <EditionButtons
              isLoading={isLoading}
              onSave={onSave}
              onCancel={onCancel}
            />
          </div>
        )}
      </div>
    }
  >
    {status === 'ACTIVE' && !isEditing && (
      <div className="mb7">
        <AddItemModal
          targetPlan={currentPlan}
          currency={currency}
          subscribedSkus={products.map((product) => product.sku.id)}
          onAddItem={onAddItem}
        />
      </div>
    )}
    {products.map((product, i) => (
      <div
        className={i !== products.length - 1 ? 'mb8' : ''}
        key={product.sku.id}
      >
        <ProductListItem
          isEditing={isEditing}
          name={product.sku.productName}
          quantity={product.quantity}
          imageUrl={product.sku.imageUrl}
          measurementUnit={product.sku.measurementUnit}
          unitMultiplier={product.sku.unitMultiplier}
          brandName={product.sku.brandName}
          price={product.currentPrice}
          currency={currency}
          canRemove={canRemove}
          onChange={(quantity: number) =>
            onUpdateQuantity(product.id, quantity)
          }
          onRemove={() => onRemoveSubscription(product.id)}
        />
      </div>
    ))}
  </Box>
)

interface Props {
  onGoToEdition: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveSubscription: (id: string) => void
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
  isEditing: boolean
  canRemove: boolean
  status: SubscriptionStatus
  products: Item[]
  currency: string
  onAddItem: (args: OnAddItemArgs) => void
  currentPlan: string
}

export default ProductsListing
