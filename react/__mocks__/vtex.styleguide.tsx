import React, { Component } from 'react'

export class Alert extends Component {
  public render() {
    return <div data-testid="alert">{this.props.children}</div>
  }
}

export class Modal extends Component {
  public render() {
    return <div>Modal</div>
  }
}

export class Button extends Component {
  public render() {
    return <button {...this.props}>{this.props.children}</button>
  }
}

export class Input extends Component {
  public render() {
    return <input {...this.props} />
  }
}

export class IconEdit extends Component {
  public render() {
    return <div {...this.props}>{this.props.children}</div>
  }
}

export class Tag extends Component {
  public render() {
    return <div {...this.props}>{this.props.children}</div>
  }
}

export function withToast(children: any) {
  return children
}
