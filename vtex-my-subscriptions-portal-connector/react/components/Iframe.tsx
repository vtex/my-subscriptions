import React, { Component } from 'react'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'

import Loading from './Loading'

if (window?.document) {
  // using var so it hoists
  /* eslint-disable */
  var iFrameResizer = require('iframe-resizer/js/iframeResizer')
  /* eslint-enable */
}
/* eslint-disable block-scoped-var */

class SubscriptionsConnectorIframe extends Component<InjectedRuntimeContext> {
  private iframe: any = null

  public state = {
    isLoading: true,
  }

  public componentDidMount = () => {
    iFrameResizer(
      {
        heightCalculationMethod: 'max',
        checkOrigin: false,
        resizeFrom: 'parent',
        autoResize: true,
      },
      this.iframe
    )

    this.iframe?.contentWindow?.addEventListener(
      'hashchange',
      this.updateParentHash
    )
  }

  public componentWillUnmount() {
    if (!this.iframe?.iFrameResizer) {
      return
    }

    this.iframe.contentWindow.removeEventListener(
      'hashchange',
      this.updateParentHash
    )

    this.iframe.iFrameResizer.removeListeners()
  }

  private getHash = (selectedWindow: Window) => selectedWindow.location.hash

  private updateParentHash = () => {
    if (!this.iframe?.contentWindow) return

    const iframeHash = this.getHash(this.iframe.contentWindow)
    const parentHash = this.getHash(window)

    if (iframeHash === parentHash) return

    if (!iframeHash.startsWith('#/subscriptions')) {
      window.location.hash = iframeHash
    }
  }

  private getRef = (ref: unknown) => {
    if (!ref) return
    this.iframe = ref
  }

  private handleCompleteLoading = () => this.setState({ isLoading: false })

  public render() {
    const { runtime } = this.props
    const { isLoading } = this.state

    return (
      <section className="vtex-account__page w-100 w-80-m pa4-s">
        {isLoading && <Loading />}
        <iframe
          title="vtex-subscriptions-page"
          className="w-100"
          // Using min-width to set the width of the iFrame, works around an issue in iOS that can prevent the iFrame from sizing correctly.
          style={{ minWidth: '100%', minHeight: '200px' }}
          scrolling="no"
          frameBorder="0"
          src={`/api/io/_v/public/my-subscriptions-router?workspace=${runtime.workspace}${window.location.hash}`} // the `/api/io` is necessary to bypass the Janus and to force a proxy to VTEX IO
          onLoad={this.handleCompleteLoading}
          ref={this.getRef}
        />
      </section>
    )
  }
}

export default withRuntimeContext(SubscriptionsConnectorIframe)
