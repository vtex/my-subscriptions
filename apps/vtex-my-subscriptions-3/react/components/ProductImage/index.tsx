import React from 'react'
import { utils } from 'vtex.my-account-commons'

import { Image } from './Image'

const { fixImageUrl } = utils

interface Props {
  productName: string
  imageUrl?: string
  width?: number
  height?: number
  isFixed?: boolean
}

const ProductImage: React.FC<Props> = ({
  productName,
  imageUrl,
  width = 300,
  height = 300,
  isFixed = false,
}: Props) => {
  return (
    <div
      className="flex items-center justify-center"
      style={isFixed ? { width, height } : { width: '100%', height: '100%' }}
    >
      <Image
        src={fixImageUrl(imageUrl, width, height)}
        productName={productName}
      />
    </div>
  )
}

export default ProductImage
