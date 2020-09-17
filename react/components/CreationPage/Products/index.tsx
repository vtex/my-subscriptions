import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'

import { Product } from '..'
import AddItemModal, { OnAddItemArgs } from '../../AddItemModal'

const Products: FunctionComponent<Props> = ({
  currentPlan,
  currency,
  products,
  onAddItem,
}) => (
  <Box
    title={
      <FormattedMessage
        id="store/creation-page.products-card.title"
        defaultMessage="Products"
      />
    }
  >
    <div className="mb5">
      <AddItemModal
        targetPlan={currentPlan}
        currency={currency}
        shouldDisplayModal={!currentPlan}
        subscribedSkus={products.map((product) => product.skuId)}
        onAddItem={onAddItem}
      />
    </div>
  </Box>
)

type Props = {
  products: Product[]
  onAddItem: (args: OnAddItemArgs) => void
  currentPlan: string | null
  currency: string
}

export default Products
