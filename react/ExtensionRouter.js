import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import SubscriptionsListContainer from './components/pages/List'
import SubscriptionDetailContainer from './components/pages/Details'
import SubscriptionProductsContainer from './components/pages/Products'

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
    <Route
      exact
      path="/subscriptions/:subscriptionId/products"
      component={SubscriptionProductsContainer}
    />
  </Fragment>
)

export default ExtensionRouter
