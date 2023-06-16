import React, { FunctionComponent } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'summarySection',
]

const BoxSection: FunctionComponent<Props> = ({
  children,
  borderTop = false,
  borderBottom = false,
}) => {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.summarySection} pa7 b--muted-4 ${borderBottom ? 'bb' : ''} ${
        borderTop ? 'bt' : ''
      }`}
    >
      {children}
    </div>
  )
}

type Props = {
  borderTop?: boolean
  borderBottom?: boolean
}

export default BoxSection
