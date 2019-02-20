import React, { FunctionComponent } from 'react'
import { IconCaretLeft, IconCaretRight } from 'vtex.styleguide'

// tslint:disable-next-line:no-var-requires
const Swiper = window.navigator ? require('react-id-swiper').default : null

import css from '../../../constants/css'
import ProductImage from '../../commons/ProductImage'

import './global.css'

interface Props {
  skus: SKUType[]
}

const SubscriptionGroupImages: FunctionComponent<Props> = ({ skus }) => {
  const params = getParams(skus.length)
  return (
    <div className={css.subscriptionGroupImageWrapper}>
      <Swiper {...params}>
        {skus.map((sku, i) => (
          <div key={i} className="swiper-slide center-all pa6 w-100">
            <ProductImage url={sku.imageUrl} alt={sku.productName} />
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

function getParams(imagesLength: number) {
  return {
    containerClass: 'swiper-container',
    navigation:
      imagesLength > 1
        ? {
            disabledClass: `c-disabled`,
            nextEl: '.swiper-caret-next',
            prevEl: '.swiper-caret-prev',
          }
        : {},
    pagination:
      imagesLength > 1
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
    resistanceRatio: imagesLength > 1 ? 0.85 : 0,
  }
}
