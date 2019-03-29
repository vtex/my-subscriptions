import React from 'react'

import SkeletonLoader from '../../../commons/SkeletonLoader'

const PaymentSkeleton = () => (
  <div className="bg-base pa6 ba bw1 b--muted-5">
    <div className="db-s di-ns b w-90">
      <SkeletonLoader width="20" size="3" />
    </div>
    <div className="w-100 dib-ns pt6">
      <SkeletonLoader width="10" size="3" />
    </div>
  </div>
)

export default PaymentSkeleton