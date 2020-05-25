import React from 'react'

import { BASIC_CARD_WRAPPER, CSS } from '../../../constants'
import SkeletonLoader from '../../SkeletonLoader'

const DataSkeleton = () => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className="flex flex-row">
      <div className="w-100">
        <SkeletonLoader width="50" size="4" />
      </div>
    </div>
    <div className="flex pt7 w-100-s mr-auto flex-row pb8-s pb0-ns">
      <div className="w-50-s w-100-ns">
        <span className="db pt3-ns">
          <SkeletonLoader width="60" size="3" />
        </span>
        <span className="db pt3">
          <SkeletonLoader width="40" size="3" />
        </span>
        <div className="pt6">
          <span className="db">
            <SkeletonLoader width="60" size="3" />
          </span>
          <span className="db pt3">
            <SkeletonLoader width="40" size="3" />
          </span>
        </div>
      </div>
      <div className="w-50-s w-100-ns">
        <div className="pt3-ns pl6-s pl0-ns">
          <span className="db">
            <SkeletonLoader width="60" size="3" />
          </span>
          <span className="db pt3">
            <SkeletonLoader width="40" size="3" />
          </span>
        </div>
        <div className="pt6 pl6-s pl0-ns">
          <span className="db">
            <SkeletonLoader width="60" size="3" />
          </span>
          <span className="db pt3">
            <SkeletonLoader width="40" size="3" />
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default DataSkeleton
