import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import SubscriptionsList from './pages/SubscriptionsList'
import SubscriptionDetail from './pages/SubscriptionDetail'
import SubscriptionProducts from './pages/SubscriptionProducts'

const ExtensionRouter = () => (
  <Fragment>
    <Route exact path="/subscriptions" component={SubscriptionsList} allowSAC />
    <Route
      exact
      path="/subscriptions/:subscriptionId"
      component={SubscriptionDetail}
    />
    <Route
      exact
      path="/subscriptions/:subscriptionId/products"
      component={SubscriptionProducts}
    />
  </Fragment>
)

export default ExtensionRouter
