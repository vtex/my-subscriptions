import React, { FunctionComponent } from 'react'

import HeaderSkeleton from './PageHeader/Skeleton'
import PreferencesSkeleton from './Preferences/Skeleton'
import ProductsSkeleton from './Products/Skeleton'
import SummarySkeleton from '../Summary/Skeleton'

const DetailsSkeleton: FunctionComponent = () => {
  return (
    <>
      <HeaderSkeleton />
      <div className="pa5 pa7-l flex flex-wrap">
        <div className="w-100 w-60-l">
          <ProductsSkeleton />
        </div>
        <div className="w-100 w-40-l pt6 pt0-l pl0 pl6-l">
          <PreferencesSkeleton />
          <SummarySkeleton />
        </div>
      </div>
    </>
  )
}

export default DetailsSkeleton
