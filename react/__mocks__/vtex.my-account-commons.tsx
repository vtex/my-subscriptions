import { Component, ReactElement } from 'react'

export class ContentWrapper extends Component<{
  children: () => ReactElement
}> {
  public render() {
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
