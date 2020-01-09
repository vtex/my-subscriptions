import React, { FunctionComponent } from 'react'
import { defineMessages } from 'react-intl'

import {
  SubscriptionStatus,
  BASIC_CARD_WRAPPER,
  CSS,
} from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import Header from '../CardHeader'
import EditionButtons from '../EditionButtons'

import ProductListItem from './ProductListItem'

import { Subscription } from '..'

const messages = defineMessages({
  title: {
    id: 'store/subscription.products.card.title',
    defaultMessage: '',
  },
})

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
  <section className={BASIC_CARD_WRAPPER}>
    <div className={CSS.cardHorizontalPadding}>
      <Header title={messages.title}>
        {!isEditing && (
          <EditButton
            onEdit={onGoToEdition}
            subscriptionStatus={subscriptionStatus}
            testId="edit-products-button"
          />
        )}
      </Header>
    </div>
    {products.map((product, i) => (
      <div
        className={`ml7-l ml5 pv7-l pv5 pr7-l pr5 b--muted-5 bw1 ${
          i !== products.length - 1 ? 'bb' : ''
        }`}
        key={`subscription-product-listing-${i}`}
      >
        <ProductListItem
          isEditing={isEditing}
          name={product.sku.productName}
          quantity={product.quantity}
          imageUrl={product.sku.imageUrl}
          description={mapVariationsToDesc(product)}
          measurementUnit={product.sku.measurementUnit}
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
    {isEditing && (
      <div className={CSS.cardHorizontalPadding}>
        <EditionButtons
          isLoading={isLoading}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    )}
  </section>
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
