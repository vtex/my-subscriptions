import React, { FunctionComponent } from 'react'

import HeaderSkeleton from './PageHeader/Skeleton'
import PreferencesSkeleton from './Preferences/Skeleton'
import ProductsSkeleton from './Products/Skeleton'
import SummarySkeleton from '../Summary/Skeleton'

const DetailsSkeleton: FunctionComponent = () => {
  return (
    <>
      <HeaderSkeleton />
      <div className="pa5 pa7-ns flex flex-wrap">
        <div className="w-100 w-60-ns">
          <ProductsSkeleton />
        </div>
        <div className="w-100 w-40-ns pt6 pt0-ns pl0 pl6-ns">
          <PreferencesSkeleton />
          <SummarySkeleton />
        </div>
      </div>
    </>
  )
}

export default DetailsSkeleton
