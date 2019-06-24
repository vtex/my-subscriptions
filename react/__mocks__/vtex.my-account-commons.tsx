import { Component } from 'react'

export class ContentWrapper extends Component {
  public render() {
    // @ts-ignore
    return this.props.children && this.props.children()
  }
}

export class BaseLoading extends Component {
  public render() {
    return this.props.children
  }
}

export const utils = {
  fixImageUrl: (url: string) => {
    return url
  },
}
