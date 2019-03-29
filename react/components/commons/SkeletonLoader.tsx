import React, { FunctionComponent } from 'react'

interface Props {
  width?: '10' | '20' | '25' | '30' | '33' | '34' | '40' | '50' | '60' | '70' | '75' | '80' | '90' | '100' | 'third' | 'two-thirds'
  size?: '0' | '1' | '2' | '3' | '4' | '5' | '6'
}

const SkeletonLoader: FunctionComponent<Props> = ({ width = '100', size }) => (
  <div className={`bg-muted-5 w-${width} ${size ? `pa${size}` : 'h-100'} relative overflow-hidden`}>
    <div className="shimmer" />
  </div>
)

export default SkeletonLoader
