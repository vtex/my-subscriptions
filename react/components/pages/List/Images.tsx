import React, { FunctionComponent } from 'react'
import { IconCaretLeft, IconCaretRight } from 'vtex.styleguide'

// tslint:disable-next-line
const Swiper = window.navigator ? require('react-id-swiper').default : null

import css from '../../../constants/css'

import './global.css'

const { subscriptionGroupImageWrapper } = css

interface Props {
  images: string[]
}

const SubscriptionGroupImages: FunctionComponent<Props> = ({ images }) => {
  const params = getParams(images)
  return (
    <div className={subscriptionGroupImageWrapper}>
      <Swiper {...params}>
        {images.map((url, i) => (
          <div key={i} className="swiper-slide center-all pa6">
            <img src={url} className="w-100" />
          </div>
        ))}
      </Swiper>
    </div>
  )
}

export default SubscriptionGroupImages

const iconSize = 17
const caretClassName =
  'pv7 absolute top-50 translate--50y z-2 pointer c-action-primary'

function getParams(images: string[]) {
  return {
    containerClass: 'swiper-container',
    navigation:
      images.length > 1
        ? {
            disabledClass: `c-disabled`,
            nextEl: '.swiper-caret-next',
            prevEl: '.swiper-caret-prev',
          }
        : {},
    pagination:
      images.length > 1
        ? {
            bulletActiveClass:
              'c-action-primary swiper-pagination-bullet-active',
            clickable: true,
            dynamicBullets: true,
            el: '.swiper-pagination',
          }
        : {},
    renderNextButton: () => (
      <span className={`swiper-caret-next pl7 right-1 ${caretClassName}`}>
        <IconCaretRight size={iconSize} />
      </span>
    ),
    renderPrevButton: () => (
      <span className={`swiper-caret-prev pr7 left-1 ${caretClassName}`}>
        <IconCaretLeft size={iconSize} />
      </span>
    ),
    resistanceRatio: images.length > 1 ? 0.85 : 0,
    zoom: {
      maxRatio: 2,
    },
  }
}
