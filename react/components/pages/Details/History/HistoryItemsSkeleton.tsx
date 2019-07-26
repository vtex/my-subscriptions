import React, { FunctionComponent, Fragment } from 'react'

import SkeletonLoader from '../../../commons/SkeletonLoader'

interface Props {
  numberOfItems: number
}

const SummarySkeleton: FunctionComponent<Props> = ({ numberOfItems = 3 }) => (
  <Fragment>
    {Array.from({ length: numberOfItems }).map((_, i) => (
      <div className="mb5 pl6" key={i}>
        <div className="mb3">
          <SkeletonLoader width="60" size="3" />
        </div>
        <SkeletonLoader width="30" size="3" />
      </div>
    ))}
  </Fragment>
)

export default SummarySkeleton
