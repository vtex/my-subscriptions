import React, { Fragment } from 'react'

import SkeletonLoader from './SkeletonLoader'

const ViewItemsSkeleton = () => (
  <Fragment>
    {[0, 1].map(index => (
      <div
        className="card bg-base center subscription__product-listing__card w-80-ns pa0-ns pa6-s ba bw1 b--muted-5 mb5"
        key={index}
      >
        <div className="flex-ns items-center-s items-start-ns">
          <div className="myo-subscription__image-size br-ns product-vertical-line b--muted-5">
            <SkeletonLoader width="100" />
          </div>
          <div className="pl9-m w-100">
            <div className="db b f4 tl c-on-base">
              <span className="mr3">
                <SkeletonLoader width="40" size="3" />
              </span>
            </div>
            <div className="flex pt3-s pt0-ns w-100 mr-auto flex-column-s flex-row-ns">
              <div className="flex flex-row w-70">
                <div className="w-50-s w-third-ns">
                  <div className="pl0-ns">
                    <span className="db">
                      <SkeletonLoader width="60" size="3" />
                    </span>
                    <span className="db pt3">
                      <SkeletonLoader width="50" size="3" />
                    </span>
                  </div>
                </div>
                <div className="w-60 pl8">
                  <div className="pl6-s pl1-ns">
                    <span className="b db">
                      <SkeletonLoader width="40" size="3" />
                    </span>
                    <div className="db pt3">
                      <SkeletonLoader width="30" size="3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Fragment>
)

export default ViewItemsSkeleton
