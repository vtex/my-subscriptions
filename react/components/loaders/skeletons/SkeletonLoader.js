import React from 'react'
import PropTypes from 'prop-types'

const SkeletonLoader = ({ width = '100' }) => (
  <div className={`pa3 bg-muted-5 w-${width} relative overflow-hidden`}>
    <div className="shimmer" />
  </div>
)

SkeletonLoader.propTypes = {
  width: PropTypes.number,
}

export default SkeletonLoader
