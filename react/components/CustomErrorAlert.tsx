import React, { FunctionComponent } from 'react'

const ErrorAlert: FunctionComponent = ({ children }) => (
  <div
    role="alert"
    className="vtex-alert t-body c-on-base pa4 br2 bg-danger--faded "
  >
    {children}
  </div>
)

export default ErrorAlert
