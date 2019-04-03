import React from 'react'
import MediaQuery from 'react-responsive'

import SkeletonLoader from './SkeletonLoader'

const ViewItemsSkeleton = () =>
  [0, 1].map(index => (
    <div key={index}>
      <MediaQuery minWidth={640}>
        <div className="card bg-base center subscription__product-listing__card w-80-ns pa0-ns pa6-s ba bw1 b--muted-5">
          <div className="flex-ns items-center-s items-start-ns">
            <div className="myo-subscription__image-size br-ns product-vertical-line b--muted-5">
              <SkeletonLoader width={100} />
            </div>
            <div className="pl9-m w-100">
              <div className="db b f4 tl c-on-base">
                <span className="mr3">
                  <SkeletonLoader width={40} />
                </span>
              </div>
              <div className="flex pt3-s pt0-ns w-100 mr-auto flex-column-s flex-row-ns">
                <div className="flex flex-row w-70">
                  <div className="w-50-s w-third-ns">
                    <div className="pl0-ns">
                      <span className="db">
                        <SkeletonLoader width={60} />
                      </span>
                      <span className="db pt3">
                        <SkeletonLoader width={50} />
                      </span>
                    </div>
                  </div>
                  <div className="w-60 pl8">
                    <div className="pl6-s pl1-ns">
                      <span className="b db">
                        <SkeletonLoader width={40} />
                      </span>
                      <div className="db pt3">
                        <SkeletonLoader width={30} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={639}>
        <div className="card bg-base center subscription__product-listing__card w-80-ns pa0-ns pa6-s ba b--muted-5">
          <div className="flex-ns items-center-s items-start-ns">
            <div className="br-ns bw1 b--muted-5 h4">
              <SkeletonImage width={40} />
            </div>
            <div className="pl9-m w-100">
              <div className="db b f4 tl c-on-base">
                <span className="mr3">
                  <SkeletonLoader width={60} />
                </span>
              </div>
              <div className="flex pt3-s pt0-ns w-100 mr-auto flex-column-s flex-row-ns pb5">
                <div className="flex flex-row">
                  <div className="w-50">
                    <div className="pl0-ns">
                      <span className="db">
                        <SkeletonLoader width={70} />
                      </span>
                      <span className="db pt3">
                        <SkeletonLoader width={50} />
                      </span>
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="pl6-s pl1-ns">
                      <span className="b db">
                        <SkeletonLoader width={70} />
                      </span>
                      <div className="pt3">
                        <SkeletonLoader width={50} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MediaQuery>
    </div>
  ))

export default ViewItemsSkeleton
