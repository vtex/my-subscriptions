import React, { FunctionComponent } from 'react'
import { defineMessages } from 'react-intl'

import {
  SubscriptionStatusEnum,
  BASIC_CARD_WRAPPER,
  CSS,
} from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import Header from '../CardHeader'
import EditionButtons from '../EditionButtons'
import ProductListItem from './ProductListItem'
import { SubscriptionProduct } from '.'

const messages = defineMessages({
  title: {
    id: 'store/subscription.products.card.title',
    defaultMessage: '',
  },
})

const ProductsListing: FunctionComponent<Props> = ({
  subscriptionStatus,
  products,
  currency,
  isEditing,
  isLoading,
  onSave,
  onCancel,
  onGoToEdition,
  onUpdateQuantity,
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
        className="ml7-l ml5 pv7-l pv5 pr7-l pr5 b--muted-5 bw1 bb"
        key={`subscription-product-listing-${i}`}
      >
        <ProductListItem
          isEditing={isEditing}
          name={product.sku.productName}
          quantity={product.quantity}
          imageUrl={product.sku.imageUrl}
          description="asduahsdusa"
          measurementUnit="un"
          price={product.priceAtSubscriptionDate}
          currency={currency}
          onChange={(quantity: number) =>
            onUpdateQuantity(product.subscriptionId, quantity)
          }
          onRemove={() => onUpdateQuantity(product.subscriptionId, 0)}
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
  onSave: () => void
  onCancel: () => void
  isLoading: boolean
  isEditing: boolean
  subscriptionStatus: SubscriptionStatusEnum
  products: SubscriptionProduct[]
  currency: string
}

export default ProductsListing
