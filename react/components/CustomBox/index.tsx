import React, { FunctionComponent, ReactNode } from 'react'
import { Box } from 'vtex.styleguide'

const CustomBox: FunctionComponent<Props> = ({ children, title, footer }) => (
  <Box noPadding>
    <div className={footer ? 'pt7' : 'pv7'}>
      {title && <h3 className="t-heading-4 mt0 ph7">{title}</h3>}
      {children}
    </div>
    {footer && (
      <div className="pv4 ph7 bg-muted-5 b--muted-4 bt c-muted-1 t-small">
        {footer}
      </div>
    )}
  </Box>
)
type Props = {
  title?: string | ReactNode
  footer?: string | ReactNode
}

export default CustomBox
