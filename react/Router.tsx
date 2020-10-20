import React from 'react'
import { Switch, HashRouter } from 'vtex.my-account-commons/Router'

import Routes from './ExtensionRouter'

const SubscriptionsRouter = () => (
  <HashRouter>
    <Switch>
      <Routes />
    </Switch>
  </HashRouter>
)

export default SubscriptionsRouter
