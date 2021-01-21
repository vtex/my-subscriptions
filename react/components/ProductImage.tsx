import React, { PureComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

// eslint-disable-next-line react/prefer-stateless-function
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
        style={isFixed ? { width, height } : {}}
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