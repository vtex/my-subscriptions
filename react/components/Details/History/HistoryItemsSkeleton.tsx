import React, { FunctionComponent, Fragment } from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

const SummarySkeleton: FunctionComponent<Props> = ({ numberOfItems = 3 }) => (
  <Fragment>
    {Array.from({ length: numberOfItems }).map((_, i) => (
      <div className="mb5 pl6" key={i}>
        <div className="mb3">
          <SkeletonPiece width="60" size="3" />
        </div>
        <SkeletonPiece width="30" size="3" />
      </div>
    ))}
  </Fragment>
)

interface Props {
  numberOfItems: number
}

export default SummarySkeleton
