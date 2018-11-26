import React from 'react'
import SkeletonLoader from '../../../commons/SkeletonLoader'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
} from 'react-accessible-accordion'

const HistorySkeleton = () => (
  <div className="myo-subscription__history">
    <Accordion>
      <AccordionItem>
        <AccordionItemTitle className="title pa5 bt br bl bw1 b--muted-5 w-100">
          <SkeletonLoader width={20} />
          <div className="pt5">
            <SkeletonLoader width={10} />
          </div>
        </AccordionItemTitle>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemTitle className="title pa5 bw1 b--muted-5 w-100">
          <SkeletonLoader width={10} />
        </AccordionItemTitle>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemTitle className="title pa5 bw1 b--muted-5 w-100">
          <SkeletonLoader width={10} />
        </AccordionItemTitle>
      </AccordionItem>
    </Accordion>
    <div className="pa5 bw1 b--muted-5 flex justify-center" />
  </div>
)

export default HistorySkeleton
