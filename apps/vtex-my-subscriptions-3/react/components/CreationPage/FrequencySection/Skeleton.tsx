import type { FunctionComponent } from 'react'
import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

const FrequencySectionSkeleton: FunctionComponent = () => (
  <>
    <SkeletonPiece width="50" size="4" />
    <div className="mt6">
      <SkeletonPiece width="50" size="4" />
    </div>
  </>
)

export default FrequencySectionSkeleton
