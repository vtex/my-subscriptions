import React, { FunctionComponent } from 'react'

interface Props {
  width?: string
  size?: string
}

const SkeletonLoader: FunctionComponent<Props> = ({ width = '100', size }) => (
  <div className={`bg-muted-5 w-${width} ${size ? `pa${size}` : 'h-100'} relative overflow-hidden`}>
    <div className="shimmer" />
  </div>
)

export default SkeletonLoader
