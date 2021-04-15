import React from 'react'

export function withRuntimeContext(Component: any) {
  // eslint-disable-next-line react/display-name
  return (props: unknown) => <Component {...props} runtime={{}} />
}
