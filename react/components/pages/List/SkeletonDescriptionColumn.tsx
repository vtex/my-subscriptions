import React, { FunctionComponent } from 'react'

import SkeletonLoader from '../../commons/SkeletonLoader'

const SkeletonDescriptionColumn: FunctionComponent = () => {
  return (
    <div className="ml4">
      <SkeletonLoader width="70" size="3" />
      <div className="mt3">
        <SkeletonLoader width="60" size="3" />
      </div>
      <div className="mt6-ns mt4-s">
        <SkeletonLoader width="70" size="3" />
        <div className="mt3">
          <SkeletonLoader width="60" size="3" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonDescriptionColumn