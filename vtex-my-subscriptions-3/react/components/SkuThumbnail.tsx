import React, { FunctionComponent } from 'react'

import Image from './ProductImage'

const SkuThumbnail: FunctionComponent<Props> = ({
  imageUrl,
  name,
  brandName,
  children,
  unitMultiplier,
  measurementUnit,
  width = 64,
  height = 64,
}) => {
  return (
    <article className="flex">
      <Image
        imageUrl={imageUrl}
        productName={name}
        width={width}
        height={height}
        isFixed
      />
      <div className="w-100 flex flex-column flex-row-ns justify-between pl4">
        <div className="w-40-ns w-100 mb0-ns mb2 pr4">
          <div className="c-muted-1 fw5 ttu f7 mb2">{brandName}</div>
          <div className="mb4 fw5">{name}</div>
          <div className="t-small c-muted-1">
            {`${unitMultiplier} ${measurementUnit}`}
          </div>
        </div>
        <div className="w-60-ns w-100 flex flex-column flex-row-ns items-center-ns justify-between-ns">
          {children}
        </div>
      </div>
    </article>
  )
}

type Props = {
  imageUrl: string
  name: string
  brandName: string
  measurementUnit: string
  unitMultiplier: number
  width?: number
  height?: number
}

export default SkuThumbnail
