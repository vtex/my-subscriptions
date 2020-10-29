import React, { Component } from 'react'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'

const IFRAME_ID = 'subscriptions-router-iframe'

if (window?.document) {
  // using var so it hoists
  /* eslint-disable */
  var iFrameResize = require('iframe-resizer/js/iframeResizer')
  /* eslint-enable */
}
/* eslint-disable block-scoped-var */

class SubscriptionsConnectorIframe extends Component<InjectedRuntimeContext> {
  private iframe: FIXME = null

  public componentDidMount = () => {
    iFrameResize(
      {
        heightCalculationMethod: 'max',
        checkOrigin: false,
        resizeFrom: 'parent',
        autoResize: true,
      },
      this.iframe
    )

    const iframe = this.getIframe()

    iframe?.contentWindow?.addEventListener('hashchange', this.updateParentHash)
  }

  public componentWillUnmount() {
    if (this.iframe && this.iframe.iFrameResizer) {
      this.iframe.iFrameResizer.removeListeners()
    }
  }

  private getIframe = () =>
    document.querySelector<HTMLIFrameElement>(`#${IFRAME_ID}`)

  private getHash = (selectedWindow: Window) => selectedWindow.location.hash

  private updateParentHash = () => {
    const iframe = this.getIframe()

    if (!iframe?.contentWindow) return

    const iframeHash = this.getHash(iframe.contentWindow)
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

  public render() {
    const { runtime } = this.props

    return (
      <section className="vtex-account__page w-100 w-80-m pa4-s">
        <iframe
          title="vtex-subscriptions-page"
          id={IFRAME_ID}
          className="w-100"
          // Using min-width to set the width of the iFrame, works around an issue in iOS that can prevent the iFrame from sizing correctly.
          style={{ minWidth: '100%', minHeight: '200px' }}
          scrolling="no"
          frameBorder="0"
          src={`/api/io/_v/public/my-subscriptions-router?workspace=${runtime.workspace}${window.location.hash}`} // the `/api/io` is necessary to bypass the Janus and to force a proxy to VTEX IO
          ref={this.getRef}
        />
      </section>
    )
  }
}

export default withRuntimeContext(SubscriptionsConnectorIframe)
