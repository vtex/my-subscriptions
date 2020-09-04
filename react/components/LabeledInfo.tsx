import React, { FunctionComponent, ReactNode } from 'react'

const LabeledInfo: FunctionComponent<Props> = ({
  label,
  children,
  labelDark = false,
}) => (
  <>
    <div className={`t-small ${labelDark ? 'c-on-base' : 'c-muted-1'} mb4`}>
      {label}
    </div>
    <div className="t-body">{children}</div>
  </>
)

interface Props {
  label: string | ReactNode
  children: ReactNode
  labelDark?: boolean
}

export default LabeledInfo
