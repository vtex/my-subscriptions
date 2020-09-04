import React, { FunctionComponent } from 'react'

const BoxSection: FunctionComponent<Props> = ({
  children,
  borderTop = false,
  borderBottom = false,
}) => (
  <div
    className={`pa7 b--muted-4 ${borderBottom ? 'bb' : ''} ${
      borderTop ? 'bt' : ''
    }`}
  >
    {children}
  </div>
)

type Props = {
  borderTop?: boolean
  borderBottom?: boolean
}

export default BoxSection
