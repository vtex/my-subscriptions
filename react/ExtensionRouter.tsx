import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

import SubscriptionsListContainer from './components/pages/List'
import SubscriptionDetailContainer from './components/pages/Details'

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
      path="/subscriptions/:orderGroup"
      component={SubscriptionDetailContainer}
    />
  </Fragment>
)

export default ExtensionRouter
