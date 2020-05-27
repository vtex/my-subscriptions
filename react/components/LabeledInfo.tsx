import React, { FunctionComponent, ReactNode } from 'react'

const LabeledInfo: FunctionComponent<Props> = ({ label, children }) => (
  <>
    <span className="b db f5-ns f6-s c-on-base">{label}</span>
    <span className="db fw3 f5-ns f6-s c-on-base mt2">{children}</span>
  </>
)

interface Props {
  label: string
  children: ReactNode
}

export default LabeledInfo
