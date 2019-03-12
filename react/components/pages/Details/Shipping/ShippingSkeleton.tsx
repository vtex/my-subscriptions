import React from 'react'

import SkeletonLoader from '../../../commons/SkeletonLoader'

const ShippingSkeleton = () => (
  <div className="card-height bg-base pa6 ba bw1 b--muted-5 pb5">
    <div className="flex flex-row pt2">
      <div className="db-s di-ns b w-100">
        <SkeletonLoader width="40" size="4" />
      </div>
    </div>
    <div className="flex pt7 w-100-s mr-auto flex-row">
      <div className="w-100">
        <span className="db pt4-ns">
          <SkeletonLoader width="40" size="3" />
        </span>
        <span className="db pt3">
          <SkeletonLoader width="30" size="3" />
        </span>
        <div className="pt8-ns pt7-s">
          <span className="db">
            <SkeletonLoader width="40" size="3" />
          </span>
          <span className="db pt3">
            <SkeletonLoader width="30" size="3" />
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default ShippingSkeleton
