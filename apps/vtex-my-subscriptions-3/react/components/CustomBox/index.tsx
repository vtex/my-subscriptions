import React, { FunctionComponent, ReactNode } from 'react'
import { Box } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import Title from './Title'

const CSS_HANDLES = [
  'summaryWrapper',
]

const CustomBox: FunctionComponent<Props> = ({ children, title, footer }) => {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Box noPadding>
      <div className={`${handles.summaryWrapper} ${title ? 'pt7' : ''} ${footer ? '' : 'pb7'}`}>
        {title && <Title>{title}</Title>}
        {children}
      </div>
      {footer && (
        <div className="pv4 ph7 bg-muted-5 b--muted-4 bt c-muted-1 t-small">
          {footer}
        </div>
      )}
    </Box>
  )
}
type Props = {
  title?: string | ReactNode
  footer?: string | ReactNode
}

export default CustomBox
