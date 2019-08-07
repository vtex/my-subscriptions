import React, { FunctionComponent } from 'react'
import { defineMessages } from 'react-intl'

import {
  SubscriptionStatusEnum,
  BASIC_CARD_WRAPPER,
  CSS,
} from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import Header from '../CardHeader'
import ProductListItem from './ProductListItem'
import { SubscriptionProduct } from '.'

const messages = defineMessages({
  title: {
    id: 'subscription.products.card.title',
    defaultMessage: '',
  },
})

const ProductsListing: FunctionComponent<Props> = ({
  onEdit,
  subscriptionStatus,
  products,
  currency,
}) => (
  <section className={BASIC_CARD_WRAPPER}>
    <div className={CSS.cardHorizontalPadding}>
      <Header title={messages.title}>
        <EditButton
          onEdit={onEdit}
          subscriptionStatus={subscriptionStatus}
          testId="edit-products-button"
        />
      </Header>
    </div>
    {products.map((product, i) => (
      <div
        className="ml7-l ml5 pv7-l pv5 pr7-l pr5 b--muted-5 bw1 bb"
        key={`subscription-product-listing-${i}`}
      >
        <ProductListItem
          name={product.sku.productName}
          quantity={product.quantity}
          imageUrl={product.sku.imageUrl}
          description="asduahsdusa"
          measurementUnit="un"
          price={product.priceAtSubscriptionDate}
          currency={currency}
        />
      </div>
    ))}
  </section>
)

interface Props {
  onEdit: () => void
  subscriptionStatus: SubscriptionStatusEnum
  products: SubscriptionProduct[]
  currency: string
}

export default ProductsListing
