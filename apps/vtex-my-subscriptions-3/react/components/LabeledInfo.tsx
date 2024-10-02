import type { FunctionComponent, ReactNode } from 'react'
import React from 'react'

const LabeledInfo: FunctionComponent<Props> = ({
  label,
  children,
  labelDark = false,
}) => (
  <div>
    <div className={`t-small ${labelDark ? 'c-on-base' : 'c-muted-1'} mb4`}>
      {label}
    </div>
    <div className="t-body">{children}</div>
  </div>
)

interface Props {
  label: string | ReactNode
  children: ReactNode
  labelDark?: boolean
}

export default LabeledInfo
