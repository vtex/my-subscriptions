import React from 'react'
import { Route } from 'vtex.my-account-commons/Router'

import ListPage from './components/List'
import DetailsPage from './components/DetailsPage'
import CreationPage from './components/CreationPage'
import { withAppInfo } from './tracking'

const ExtensionRouter = () => (
  <>
    <Route exact path="/subscriptions" component={ListPage} />
    <Route exact path="/subscriptions-new" component={CreationPage} />
    <Route
      exact
      path="/subscriptions/:subscriptionId"
      component={DetailsPage}
    />
  </>
)

export default withAppInfo(ExtensionRouter)
