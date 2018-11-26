import React from 'react'
import PropTypes from 'prop-types'

const SkeletonImage = ({ width = '100' }) => (
  <div
    className={`pa3 bg-muted-5 w-${width} center relative overflow-hidden h-100`}>
    <div className="shimmer" />
  </div>
)

SkeletonImage.propTypes = {
  width: PropTypes.number,
}

export default SkeletonImage
