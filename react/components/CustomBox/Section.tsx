import React, { FunctionComponent } from 'react'

const BoxSection: FunctionComponent<Props> = ({
  children,
  borderTop = false,
}) => (
  <div className={`pa7 b--muted-4 bb ${borderTop ? 'bt' : ''}`}>{children}</div>
)

type Props = {
  borderTop?: boolean
}

export default BoxSection
