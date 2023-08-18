import React from 'react'
import { useImage } from 'react-image'

import IconPlaceholder from './IconPlaceholder'

interface ImageProps {
  src: string
  productName: string
}

export const Image: React.FC<ImageProps> = ({ src, productName }) => {
  const { src: srcImage, isLoading } = useImage({
    srcList: src,
    useSuspense: false,
  })

  return (
    <>
      {<IconPlaceholder />}
      {
        <img
          className="w-100 h-100"
          src={srcImage}
          alt={productName}
          style={{
            transition: 'opacity 1s ease-in-out',
            WebkitTransition: 'opacity 1s ease-in-out',
            MozTransition: 'opacity 1s ease-in-out',
            OTransition: 'opacity 1s ease-in-out',
            opacity: isLoading ? 0 : 1,
          }}
        />
      }
    </>
  )
}
