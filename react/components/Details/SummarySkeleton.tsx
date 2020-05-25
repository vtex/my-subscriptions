import React from 'react'

import SkeletonLoader from '../../commons/SkeletonLoader'

const SummarySkeleton = () => (
  <div className="card bg-base pa6 ba bw1 b--muted-5">
    <div className="flex-ns items-center-s items-start-ns">
      <div className="flex flex-column w-20">
        <span className="db">
          <SkeletonLoader width="70" size="4" />
        </span>
        <div className="pt5 w-90">
          <div className="relative items-center ba-ns bw1 b--muted-5 h4 w-100">
            <SkeletonLoader width="100" />
          </div>
        </div>
      </div>
      <div className="pt8-m pt6-s flex-grow-1">
        <span className="db pt4-ns b f4 tl c-on-base">
          <SkeletonLoader width="40" size="3" />
        </span>
        <div className="flex flex-row w-50 pt5">
          <div className="w-60">
            <SkeletonLoader width="70" size="3" />
          </div>
          <div className="w-40">
            <SkeletonLoader width="60" size="3" />
          </div>
        </div>
        <div className="flex flex-row w-50 pt5">
          <div className="w-60">
            <SkeletonLoader width="70" size="3" />
          </div>
          <div className="w-40">
            <SkeletonLoader width="60" size="3" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default SummarySkeleton
