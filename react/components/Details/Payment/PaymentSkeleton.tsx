import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

const PaymentSkeleton = () => (
  <>
    <div className="db-s di-ns b w-90">
      <SkeletonPiece width="20" size="3" />
    </div>
    <div className="w-100 dib-ns pt6">
      <SkeletonPiece width="10" size="3" />
    </div>
  </>
)

export default PaymentSkeleton
