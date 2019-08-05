import React, { FunctionComponent } from 'react'
import { defineMessages } from 'react-intl'

import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import Header from '../CardHeader'
import EditionButtons from '../EditionButtons'

const messages = defineMessages({
  title: {
    id: 'subscription.products.card.title',
    defaultMessage: '',
  },
})

const ProductsEdition: FunctionComponent<Props> = ({
  isLoading,
  onSave,
  onCancel,
}) => {
  return (
    <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
      <Header title={messages.title} />
      <EditionButtons
        isLoading={isLoading}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  )
}

interface Props {
  isLoading: boolean
  onSave: () => void
  onCancel: () => void
}

export default ProductsEdition
