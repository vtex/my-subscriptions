import React, { FunctionComponent, ReactNode } from 'react'

const LabeledInfo: FunctionComponent<Props> = ({ label, children }) => (
  <>
    <div className="t-small c-muted-1 mb2">{label}</div>
    <div className="t-body">{children}</div>
  </>
)

interface Props {
  label: string | ReactNode
  children: ReactNode
}

export default LabeledInfo
