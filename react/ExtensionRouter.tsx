import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'

import SubscriptionsListContainer from './components/List'
import SubscriptionDetailContainer from './components/Details'
import { withAppInfo } from './tracking'

const ExtensionRouter = () => (
  <Fragment>
    <Route
      exact
      path="/subscriptions"
      component={SubscriptionsListContainer}
      allowSAC
    />
    <Route
      exact
      path="/subscriptions/:subscriptionId"
      component={SubscriptionDetailContainer}
    />
  </Fragment>
)

export default withAppInfo(ExtensionRouter)
