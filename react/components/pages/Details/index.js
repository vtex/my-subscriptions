import React from 'react'
import PropTypes from 'prop-types'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { injectIntl, intlShape } from 'react-intl'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { ContentWrapper } from 'vtex.my-account-commons'

import GET_GROUPED_SUBSCRIPTION from '../../../graphql/getGroupedSubscription.gql'
import CACHED_FRAGMENT from '../../../graphql/fragmentGroupedSubscription.gql'
import DataCard from './DataCard/DataCardContainer'
import Summary from './Summary'
import Payment from './Payment'
import History from './History'
import Shipping from './Shipping'
import SubscriptionDetailsLoader from './Loader'
import { subscriptionShape } from '../../../proptypes'
import { cacheLocator } from '../../../utils/cacheLocator'

export const headerConfig = ({ intl }) => {
  const backButton = {
    title: intl.formatMessage({ id: 'subscription.title.list' }),
    path: '/subscriptions',
  }

  return {
    backButton,
    title: intl.formatMessage({ id: 'subscription.title.single' }),
    namespace: 'vtex-account__subscription-details',
  }
}

const SubscriptionDetailsContainer = ({ subscription, intl }) => {
  return (
    <ContentWrapper {...headerConfig({ intl })}>
      {() => (
        <div className="mr0 center w-100 pb5">
          <Summary subscription={subscription} />
          <div className="flex flex-row-ns flex-column-s">
            <div className="pt6 pr4-ns w-50-ns">
              <DataCard subscription={subscription} />
            </div>
            <div className="pl4-ns pt6 w-50-ns">
              <Shipping subscription={subscription} />
            </div>
          </div>
          <div className="pt6">
            <Payment subscription={subscription} />
          </div>
          <div className="pt6 mb8">
            <History instances={subscription.instances} />
          </div>
        </div>
      )}
    </ContentWrapper>
  )
}

const subscriptionQuery = {
  options: props => ({
    variables: {
      orderGroup: props.match.params.subscriptionId,
    },
    errorPolicy: 'all',
  }),
}

SubscriptionDetailsContainer.propTypes = {
  intl: intlShape.isRequired,
  subscription: subscriptionShape.isRequired,
  client: PropTypes.object,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
}

const enhance = compose(
  injectIntl,
  withRouter,
  withApollo,
  graphql(GET_GROUPED_SUBSCRIPTION, subscriptionQuery),
  withProps(({ client, match }) => ({
    cachedSubscriptionQuery: client.readFragment({
      id: cacheLocator.groupedSubscription(match.params.subscriptionId),
      fragment: CACHED_FRAGMENT,
    }),
  })),
  withProps(({ data, cachedSubscriptionQuery }) => ({
    subscription: cachedSubscriptionQuery || data.groupedSubscription,
  })),
  branch(
    ({ subscription }) => !subscription,
    renderComponent(SubscriptionDetailsLoader)
  )
)

export default enhance(SubscriptionDetailsContainer)
