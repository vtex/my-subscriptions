import React, { FunctionComponent } from 'react'

import { CSS } from '../../constants'
import SkeletonLoader from '../SkeletonLoader'

const SubscriptionsGroupsLoading: FunctionComponent = () => {
  return (
    <div className="w-100">
      {[0, 1].map((index) => (
        <div className={CSS.subscriptionGroupItemWrapper} key={index}>
          <div className={CSS.subscriptionGroupImageWrapper}>
            <SkeletonLoader />
          </div>
          <div className="ml6-ns ml0-s mt0-ns mt3-s w-100 mb3">
            <div className="mv6 w-40-ns w-90-s">
              <SkeletonLoader size="4" />
            </div>
            <div className="mt3 w-70-ns w-100-s flex flex-row-s flex-column flex-nowrap flex-wrap-s">
              <div className="w-50-ns w-100-s">
                <div className="mt9-ns mt4-s">
                  <SkeletonLoader width="70" size="3" />
                  <div className="mt4">
                    <SkeletonLoader width="60" size="3" />
                  </div>
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
