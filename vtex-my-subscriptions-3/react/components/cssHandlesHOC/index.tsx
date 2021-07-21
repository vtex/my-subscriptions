/* eslint-disable react/display-name */
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

export const cssHandlesHOC = (Component: any, cssHandles: string[]) => {
  return (props: any) => {
    const handles = useCssHandles(cssHandles)

    return <Component handles={handles} {...props} />
  }
}
