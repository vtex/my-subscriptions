import React from 'react'

import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import SkeletonLoader from '../../../commons/SkeletonLoader'
import HistoryItemsSkeleton from './HistoryItemsSkeleton'

const HistorySkeleton = () => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className="flex">
      <div className="db-s di-ns b w-100">
        <SkeletonLoader width="40" size="4" />
      </div>
    </div>
    <div className="flex pt7 w-100-s mr-auto">
      <div className="w-100">
        <HistoryItemsSkeleton numberOfItems={5} />
      </div>
    </div>
  </div>
)

export default HistorySkeleton
