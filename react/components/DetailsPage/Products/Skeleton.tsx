import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SkeletonPiece } from 'vtex.my-account-commons'
import { Box } from 'vtex.styleguide'

const ProductsSkeleton = () => (
  <Box title={<FormattedMessage id="store/subscription.products.card.title" />}>
    <div className="w-100 flex">
      <div style={{ height: '100px', width: '100px' }}>
        <SkeletonPiece />
      </div>
      <div className="pl6 w-50">
        <SkeletonPiece width="50" size="4" />
      </div>
    </div>
    <div className="w-100 pt8 flex">
      <div style={{ height: '100px', width: '100px' }}>
        <SkeletonPiece />
      </div>
      <div className="pl6 w-50">
        <SkeletonPiece width="50" size="4" />
      </div>
    </div>
  </Box>
)

export default ProductsSkeleton
