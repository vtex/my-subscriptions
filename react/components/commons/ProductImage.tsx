import React, { PureComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

class ProductImage extends PureComponent<Props> {
  public static defaultProps = {
    widthSize: 300,
    heightSize: 300,
    isFixed: false,
  }

  public render() {
    const { productName, imageUrl, widthSize, heightSize, isFixed } = this.props

    return (
      <img
        src={fixImageUrl(imageUrl, widthSize, heightSize)}
        alt={productName}
        style={isFixed ? { width: widthSize, height: heightSize } : {}}
      />
    )
  }
}

interface Props {
  productName: string
  imageUrl: string
  widthSize: number
  heightSize: number
  isFixed: boolean
}

export default ProductImage
