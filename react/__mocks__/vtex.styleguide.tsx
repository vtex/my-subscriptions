import React, { Component } from 'react'

export class Alert extends Component {
  public render() {
    return <div data-testid="alert">{this.props.children}</div>
  }
}

export class ModalDialog extends Component {
  public render() {
    return <div>Modal</div>
  }
}

export class Button extends Component {
  public render() {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isLoading, ...rest } = this.props

    return <button {...rest}>{this.props.children}</button>
  }
}

export class Input extends Component {
  public render() {
    return <input {...this.props} />
  }
}

export class IconEdit extends Component {
  public render() {
    return <div>{this.props.children}</div>
  }
}

export class IconDelete extends Component {
  public render() {
    return <div>{this.props.children}</div>
  }
}

export class NumericStepper extends Component {
  public render() {
    return <input />
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
