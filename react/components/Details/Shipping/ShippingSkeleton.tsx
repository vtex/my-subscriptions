import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

const ShippingSkeleton = () => (
  <>
    <div className="db-s di-ns b w-100">
      <SkeletonPiece width="40" size="4" />
    </div>
    <div className="flex pt7 w-100-s mr-auto">
      <div className="w-100">
        <span className="db pt3-ns">
          <SkeletonPiece width="40" size="3" />
        </span>
        <span className="db pt3">
          <SkeletonPiece width="30" size="3" />
        </span>
        <div className="pt8-ns pt7-s">
          <span className="db">
            <SkeletonPiece width="40" size="3" />
          </span>
          <span className="db pt3">
            <SkeletonPiece width="30" size="3" />
          </span>
        </div>
      </div>
    </div>
  </>
)

export default ShippingSkeleton
