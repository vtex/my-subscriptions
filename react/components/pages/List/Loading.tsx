import React, { FunctionComponent } from 'react'

import SkeletonLoader from '../../commons/SkeletonLoader'
import DescriptionColumn from './SkeletonDescriptionColumn'

const SubscriptionsGroupsLoading: FunctionComponent = () => {
  return (
    <div className="w-100">
      {[0, 1].map(index => (
        <div className="subscription__listing-card mb6 bg-base center pa0-ns pa6-s ba bw1 b--muted-5" key={index}>
          <div className="flex flex-row-ns flex-column-s">
            <div className="flex-none h5 w5 center">
              <SkeletonLoader />
            </div>
            <div className="ml6-ns ml0-s mt0-ns mt3-s w-100">
              <div className="mv7 w-40-ns w-70-s">
                <SkeletonLoader size="4"/>
              </div>
              <div className="mt3 w-70-ns w-100-s flex flex-row-s flex-column flex-nowrap flex-wrap-s">
                <div className="w-50-ns w-100-s">
                  <DescriptionColumn />
                </div>
                <div className="w-50-ns w-100-s mt0-ns mt6-s">
                  <DescriptionColumn />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubscriptionsGroupsLoading