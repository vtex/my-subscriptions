import React, { FunctionComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

const ProductImage: FunctionComponent<Props> = ({
  productName,
  imageUrl,
  widthSize = 300,
  heightSize = 300,
}: Props) => {
  return (
    <img src={fixImageUrl(imageUrl, widthSize, heightSize)} alt={productName} />
  )
}

interface Props {
  productName: string
  imageUrl: string
  widthSize?: number
  heightSize?: number
}

export default ProductImage
