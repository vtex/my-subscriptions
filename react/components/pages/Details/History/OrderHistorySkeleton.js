import React from 'react'
import {
  AccordionItem,
  AccordionItemTitle,
} from 'react-accessible-accordion'

import SkeletonLoader from '../../../commons/SkeletonLoader'

const OrderHistorySkeleton = () => {
  return (
    <AccordionItem>
      <AccordionItemTitle className="title pa5 bb bl br b--muted-5 w-100">
        <SkeletonLoader width={10} />
      </AccordionItemTitle>
    </AccordionItem>
  )
}

export default OrderHistorySkeleton
