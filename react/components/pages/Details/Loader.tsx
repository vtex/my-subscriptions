import React, { FunctionComponent } from 'react'

import ShippingSkeleton from './Shipping/ShippingSkeleton'
import HistorySkeleton from './History/HistorySkeleton'
import DataSkeleton from './DataCard/DataSkeleton'
import SummarySkeleton from './SummarySkeleton'
import PaymentSkeleton from './Payment/PaymentSkeleton'

const SubscriptionDetailsLoader: FunctionComponent = () => (
  <div className="mr0 center w-100 pb5">
    <SummarySkeleton />
    <div className="flex flex-row-ns flex-column-s">
      <div className="pt6 pr4-ns w-50-ns">
        <DataSkeleton />
      </div>
      <div className="pl4-ns pt6 w-50-ns">
        <ShippingSkeleton />
      </div>
    </div>
    <div className="flex flex-row-ns flex-column-s">
      <div className="pt6 pr4-ns w-50-ns">
        <PaymentSkeleton />
      </div>
      <div className="pl4-ns pt6 w-50-ns">
        <HistorySkeleton />
      </div>
    </div>
  </div>
)

export default SubscriptionDetailsLoader
