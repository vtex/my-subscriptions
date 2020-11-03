import React, { FunctionComponent } from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

const IframeLoading: FunctionComponent = () => (
  <div className="w-100 h-100">
    <SkeletonPiece />
  </div>
)

export default IframeLoading
