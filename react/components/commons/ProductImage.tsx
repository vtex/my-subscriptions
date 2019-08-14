import React, { PureComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

class ProductImage extends PureComponent<Props> {
  public static defaultProps = {
    widthSize: 300,
    heightSize: 300,
  }

  public render() {
    const { productName, imageUrl, widthSize, heightSize } = this.props

    return (
      <img
        src={fixImageUrl(imageUrl, widthSize, heightSize)}
        alt={productName}
        style={{ width: widthSize, height: heightSize }}
      />
    )
  }
}

interface Props {
  productName: string
  imageUrl: string
  widthSize: number
  heightSize: number
}

export default ProductImage
