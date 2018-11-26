import React from 'react'
import SkeletonLoader from '../commons/SkeletonLoader'
import SkeletonImage from '../commons/SkeletonImage'
import MediaQuery from 'react-responsive'

const SummarySkeleton = () => (
  <div>
    <MediaQuery minWidth={640}>
      <div className="card bg-base pa6 ba bw1 b--muted-5">
        <div className="flex-ns items-center-s items-start-ns">
          <div className="flex flex-column w-20">
            <span className="db">
              <SkeletonLoader width={70} />
            </span>
            <div className="pt5 w-90">
              <div className="relative items-center ba-ns bw1 b--muted-5 h4 w-100">
                <SkeletonImage />
              </div>
            </div>
          </div>
          <div className="pt8-m pt6-s flex-grow-1">
            <span className="db pt4-ns b f4 tl c-on-base">
              <SkeletonLoader width={40} />
            </span>
            <div className="flex flex-row w-50 pt5">
              <div className="w-60">
                <SkeletonLoader width={70} />
              </div>
              <div className="w-40">
                <SkeletonLoader width={60} />
              </div>
            </div>
            <div className="flex flex-row w-50 pt5">
              <div className="w-60">
                <SkeletonLoader width={70} />
              </div>
              <div className="w-40">
                <SkeletonLoader width={60} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MediaQuery>
    <MediaQuery maxWidth={639}>
      <div className="card bg-base pa6 ba bw1 b--muted-5">
        <div className="flex-ns items-center-s items-start-ns">
          <div className="pl9-m w-100 pb6">
            <div className="db b">
              <SkeletonLoader width={50} />
            </div>
          </div>
          <div className="br-ns b--muted-5 h4">
            <SkeletonImage width={40} />
          </div>
          <div className="pt8-m pt6-s flex-grow-1 pb8-s">
            <span className="db pt4-ns b">
              <SkeletonLoader width={40} />
            </span>
            <div className="flex flex-row pt7">
              <div className="w-60">
                <SkeletonLoader width={50} />
              </div>
              <div className="w-40">
                <SkeletonLoader width={100} />
              </div>
            </div>
            <div className="flex flex-row pt5">
              <div className="w-60">
                <SkeletonLoader width={50} />
              </div>
              <div className="w-40">
                <SkeletonLoader width={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MediaQuery>
  </div>
)

export default SummarySkeleton
