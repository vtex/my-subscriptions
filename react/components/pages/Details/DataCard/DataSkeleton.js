import React from 'react'

import SkeletonLoader from '../../../commons/SkeletonLoader'

const DataSkeleton = () => (
  <div className="card-height bg-base pa6 ba bw1 b--muted-5 pb5">
    <div className="flex flex-row">
      <div className="db-s di-ns b f4 w-100">
        <SkeletonLoader width={50} />
      </div>
    </div>
    <div className="flex pt7 w-100-s mr-auto flex-row pb8-s pb0-ns">
      <div className="w-50-s w-100-ns">
        <span className="db pt3-ns">
          <SkeletonLoader width={60} />
        </span>
        <span className="db pt3">
          <SkeletonLoader width={40} />
        </span>
        <div className="pt6">
          <span className="db">
            <SkeletonLoader width={60} />
          </span>
          <span className="db pt3">
            <SkeletonLoader width={40} />
          </span>
        </div>
      </div>
      <div className="w-50-s w-100-ns">
        <div className="pt3-ns pl6-s pl0-ns">
          <span className="db">
            <SkeletonLoader width={60} />
          </span>
          <span className="db pt3">
            <SkeletonLoader width={40} />
          </span>
        </div>
        <div className="pt6 pl6-s pl0-ns">
          <span className="db">
            <SkeletonLoader width={60} />
          </span>
          <span className="db pt3">
            <SkeletonLoader width={40} />
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default DataSkeleton
