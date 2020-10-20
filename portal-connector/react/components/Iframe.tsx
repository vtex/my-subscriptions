import React, { Component } from 'react'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'

const IFRAME_ID = 'subscriptions-router-iframe'

class SubscriptionsConnectorIframe extends Component<InjectedRuntimeContext> {
  public componentDidMount = () => {
    const iframe = this.getIframe()

    iframe?.contentWindow?.addEventListener('hashchange', this.updateParentHash)
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

  public render() {
    const { runtime } = this.props

    return (
      <iframe
        id={IFRAME_ID}
        className="bn"
        width="100%"
        height="100%"
        src={`/api/io/_v/public/my-subscriptions-router?workspace=${runtime.workspace}${window.location.hash}`} // the `/api/io` is necessary to bypass the Janus and to force a proxy to VTEX IO
      />
    )
  }
}

export default withRuntimeContext(SubscriptionsConnectorIframe)
