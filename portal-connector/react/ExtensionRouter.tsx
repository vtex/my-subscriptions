import React from 'react'
import { Route } from 'vtex.my-account-commons/Router'

import Iframe from './components/Iframe'

const ExtensionRouter = () => (
  <>
    <Route exact path="/subscriptions" component={Iframe} />
    <Route exact path="/subscriptions-new" component={Iframe} />
    <Route exact path="/subscriptions/:subscriptionId" component={Iframe} />
  </>
)
export default ExtensionRouter
