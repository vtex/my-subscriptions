import React, { FunctionComponent } from 'react'

import SkeletonLoader from '../../commons/SkeletonLoader'

const SkeletonDescriptionColumn: FunctionComponent = () => {
  return (
    <div>
      <div className="mt9-ns mt4-s">
        <SkeletonLoader width="70" size="3" />
        <div className="mt4">
          <SkeletonLoader width="60" size="3" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonDescriptionColumn
