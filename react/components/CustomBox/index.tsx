import React, { FunctionComponent, ReactNode } from 'react'
import { Box } from 'vtex.styleguide'

const CustomBox: FunctionComponent<Props> = ({ children, title }) => (
  <Box noPadding>
    <div className="pv7">
      {title && <h3 className="t-heading-4 mt0 ph7">{title}</h3>}
      {children}
    </div>
  </Box>
)
type Props = {
  title?: string | ReactNode
}

export default CustomBox
