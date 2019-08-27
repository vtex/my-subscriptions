import React, { PureComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

class ProductImage extends PureComponent<Props> {
  public static defaultProps = {
    width: 300,
    height: 300,
    isFixed: false,
  }

  public render() {
    const { productName, imageUrl, width, height, isFixed } = this.props

    return (
      <img
        src={fixImageUrl(imageUrl, width, height)}
        alt={productName}
        style={isFixed ? { width: width, height: height } : {}}
      />
    )
  }
}

interface Props {
  productName: string
  imageUrl: string
  width: number
  height: number
  isFixed: boolean
}

export default ProductImage
