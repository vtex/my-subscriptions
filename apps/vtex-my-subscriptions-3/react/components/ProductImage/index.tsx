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
    isLoading: true,
    hasLoadError: false,
  }

  private handleStopLoading = () => {
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 100)
  }

  private handleError = () => {
    this.handleStopLoading()
    this.setState({ hasLoadError: true })
  }

  public render() {
    const { productName, imageUrl, width, height, isFixed } = this.props
    const { isLoading, hasLoadError } = this.state

    const hasImage = !!imageUrl
    const displayPaceholder = isLoading || hasLoadError || !hasImage
    const displayImage = !hasLoadError && hasImage

    // The events onLoad and onError not always are triggered
    setTimeout(() => {
      if(hasImage && isLoading) {
        this.setState({ isLoading: false })
      }
    }, 100);

    return (
      <div
        className="flex items-center justify-center"
        style={isFixed ? { width, height } : { width: '100%', height: '100%' }}
      >
        {displayImage && (
          <img
            className="w-100 h-100"
            src={fixImageUrl(imageUrl, width, height)}
            alt={productName}
            onLoad={this.handleStopLoading}
            onError={this.handleError}
          />
        )}
        {displayPaceholder && <IconPlaceholder />}
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
