import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { CSS } from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import EditionButtons from '../EditionButtons'

import ProductListItem from './ProductListItem'

import { Subscription } from '..'

function mapVariationsToDesc(product: Subscription) {
  const variations = product.sku.variations
    ? Object.keys(product.sku.variations)
    : []

  return variations.reduce(
    (description, variationKey, index) =>
      `${description} ${variationKey}: ${product.sku.variations &&
        product.sku.variations[variationKey]}${
        index === variations.length - 1 ? '' : ';'
      }`,
    ''
  )
}

const ProductsListing: FunctionComponent<Props> = ({
  subscriptionStatus,
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
}) => (
  <Box>
    <div className={`${CSS.cardTitle} flex justify-between h2`}>
      <FormattedMessage id="store/subscription.products.card.title" />
      {!isEditing && (
        <EditButton
          onEdit={onGoToEdition}
          subscriptionStatus={subscriptionStatus}
          testId="edit-products-button"
        />
      )}
    </div>
    {products.map((product, i) => (
      <div
        className={`p${i === 0 ? 'b' : 'v'}7-l p${
          i === 0 ? 'b' : 'v'
        }5 b--muted-5 bw1 ${i !== products.length - 1 ? 'bb' : ''}`}
        key={`subscription-product-listing-${i}`}
      >
        <ProductListItem
          isEditing={isEditing}
          name={product.sku.productName}
          quantity={product.quantity}
          imageUrl={product.sku.imageUrl}
          description={mapVariationsToDesc(product)}
          measurementUnit={product.sku.measurementUnit}
          price={product.priceAtSubscriptionDate}
          currency={currency}
          canRemove={canRemove}
          onChange={(quantity: number) =>
            onUpdateQuantity(product.id, quantity)
          }
          onRemove={() => onRemoveSubscription(product.id)}
        />
      </div>
    ))}
    {isEditing && (
      <div className={CSS.cardHorizontalPadding}>
        <EditionButtons
          isLoading={isLoading}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    )}
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
  subscriptionStatus: SubscriptionStatus
  products: Subscription[]
  currency: string
}

export default ProductsListing
