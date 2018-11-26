import React from 'react'
import SkeletonLoader from '../../commons/SkeletonLoader'

const PaymentSkeleton = () => (
  <div className="card bg-base pa6 ba bw1 b--muted-5">
    <div>
      <div className="db-s di-ns b w-90">
        <SkeletonLoader width={20} />
      </div>
      <div className="w-100 dib-ns pt6">
        <SkeletonLoader width={10} />
      </div>
    </div>
  </div>
)

export default PaymentSkeleton
