import React, { Fragment, FunctionComponent } from 'react'

import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

interface Props {
  className?: string
  url: string
  alt: string
}

const ProductImage: FunctionComponent<Props> = ({
  className,
  url,
  alt,
}: Props) => {
  return (
    <Fragment>
      <img
        className={`${className}`}
        src={fixImageUrl(url, 300, 300)}
        alt={alt}
      />
    </Fragment>
  )
}

export default ProductImage
