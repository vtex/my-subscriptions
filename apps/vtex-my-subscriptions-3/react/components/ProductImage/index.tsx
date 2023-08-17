import React, { PureComponent } from 'react'
import { utils } from 'vtex.my-account-commons'

import IconPlaceholder from './IconPlaceholder'

const { fixImageUrl } = utils

// eslint-disable-next-line react/prefer-stateless-function
class ProductImage extends PureComponent<Props> {
  public static defaultProps = {
    width: 300,
    height: 300,
    isFixed: false,
  }

  public state = {
    displayPlaceholder: true,
  }

  private handleStopLoading = () => {
    this.setState({ displayPlaceholder: false })
  }

  private handleError = () => {
    this.setState({ displayPlaceholder: true })
  }

  public render() {
    const { productName, imageUrl, width, height, isFixed } = this.props
    const { displayPlaceholder } = this.state

    return (
      <div
        className="flex items-center justify-center"
        style={isFixed ? { width, height } : { width: '100%', height: '100%' }}
      >
        {displayPlaceholder && <IconPlaceholder />}
        {Boolean(imageUrl) && (
          <img
            className="w-100 h-100"
            src={fixImageUrl(imageUrl, width, height)}
            alt={productName}
            onLoad={this.handleStopLoading}
            onError={this.handleError}
          />
        )}
      </div>
    )
  }
}

interface Props {
  productName: string
  imageUrl?: string
  width: number
  height: number
  isFixed: boolean
}

export default ProductImage
