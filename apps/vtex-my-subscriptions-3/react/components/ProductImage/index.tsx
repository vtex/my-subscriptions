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
    setTimeout(() => this.setState({ isLoading: false }), 100)
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

    return (
      <div
        className="flex items-center justify-center"
        style={isFixed ? { width, height } : { width: '100%', height: '100%' }}
      >
        {displayPaceholder && <IconPlaceholder />}
        {displayImage && (
          <img
            className="w-100 h-100"
            src={fixImageUrl(imageUrl, width, height)}
            alt={productName}
            style={{
              // Fix blinking behavior
              height: isLoading ? 0 : '100%',
              transition: 'opacity 1s ease-in-out',
              WebkitTransition: 'opacity 1s ease-in-out',
              MozTransition: 'opacity 1s ease-in-out',
              OTransition: 'opacity 1s ease-in-out',
              opacity: isLoading ? 0 : 1,
            }}
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
