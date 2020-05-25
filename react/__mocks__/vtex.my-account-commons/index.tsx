import React, { Component } from 'react'

export class ContentWrapper extends Component {
  public render() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return this.props.children && this.props.children()
  }
}

export class BaseLoading extends Component {
  public render() {
    return this.props.children
  }
}

export const SkeletonPiece = () => {
  return <>Loading</>
}

export const utils = {
  fixImageUrl: (url: string) => {
    return url
  },
}
