import React, { FunctionComponent, ReactElement } from 'react'

export const AddressSummary: FunctionComponent = () => {
  return <div>AddressSummary</div>
}

export const AddressRules: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => {
  return children
}
