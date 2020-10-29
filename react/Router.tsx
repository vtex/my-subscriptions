import React from 'react'
import { Switch, HashRouter } from 'vtex.my-account-commons/Router'

import Routes from './ExtensionRouter'

if (window?.document) {
  // using var so it hoists
  /* eslint-disable */
  require('iframe-resizer/js/iframeResizer.contentWindow')
  /* eslint-enable */
}

const SubscriptionsRouter = () => (
  <HashRouter>
    <Switch>
      <Routes />
    </Switch>
  </HashRouter>
)

export default SubscriptionsRouter
