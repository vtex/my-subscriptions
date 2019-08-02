import React, { FunctionComponent } from 'react'
import { defineMessages } from 'react-intl'

import { CSS, SubscriptionStatusEnum } from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import Header from '../CardHeader'

const messages = defineMessages({
  title: {
    id: 'subscription.products.card.title',
    defaultMessage: '',
  },
})

const ProductsListing: FunctionComponent<Props> = ({
  onEdit,
  subscriptionStatus,
}) => (
  <div className={CSS.cardWrapper}>
    <Header title={messages.title}>
      <EditButton
        onEdit={onEdit}
        subscriptionStatus={subscriptionStatus}
        testId="edit-products-button"
      />
    </Header>
  </div>
)

interface Props {
  onEdit: () => void
  subscriptionStatus: SubscriptionStatusEnum
}

export default ProductsListing
