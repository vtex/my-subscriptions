import type { FunctionComponent } from 'react'
import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

import { CSS } from './utils'

const SubscriptionsLoading: FunctionComponent = () => {
  return (
    <div className="w-100">
      {[0, 1].map(index => (
        <div className={CSS.subscriptionItemWrapper} key={index}>
          <div className={CSS.subscriptionImageWrapper}>
            <SkeletonPiece />
          </div>
          <div className="ml6-ns ml0-s mt0-ns mt3-s w-100 mb3">
            <div className="mv6 w-40-ns w-90-s">
              <SkeletonPiece size="4" />
            </div>
            <div className="mt3 w-70-ns w-100-s flex flex-row-s flex-column flex-nowrap flex-wrap-s">
              <div className="w-50-ns w-100-s">
                <div className="mt9-ns mt4-s">
                  <SkeletonPiece width="70" size="3" />
                  <div className="mt4">
                    <SkeletonPiece width="60" size="3" />
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

export default SubscriptionsLoading
