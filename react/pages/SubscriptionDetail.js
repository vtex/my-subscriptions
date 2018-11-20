import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { buildCacheLocator } from 'render'
import { injectIntl, intlShape } from 'react-intl'
import { compose, graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Alert } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'

import GetGroupedSubscription from '../graphql/getGroupedSubscription.gql'
import cachedFragment from '../graphql/fragmentGroupedSubscription.gql'
import Summary from '../components/Subscription/Summary'
import Payment from '../components/Subscription/Payment/index'
import History from '../components/Subscription/History/index'
import DataCard from '../components/Subscription/DataCard/DataCardContainer'
import Shipping from '../components/Subscription/Shipping/index'
import ShippingSkeleton from '../components/Subscription/Shipping/ShippingSkeleton'
import PaymentSkeleton from '../components/Subscription/Payment/PaymentSkeleton'
import DataSkeleton from '../components/Subscription/DataCard/DataSkeleton'
import SummarySkeleton from '../components/Subscription/SummarySkeleton'
import HistorySkeleton from '../components/Subscription/History/HistorySkeleton'

class ViewSubscription extends Component {
  handleGoToSubscriptionsPage = () => {
    this.props.history.push('/subscriptions')
  }

  render() {
    const { subscriptionData, client, intl, match } = this.props
    const { groupedSubscription, error } = subscriptionData

    const backButton = {
      title: intl.formatMessage({ id: 'subscription.title.list' }),
      path: '/subscriptions',
    }
    const renderWrapper = children => {
      return (
        <ContentWrapper
          title={intl.formatMessage({ id: 'subscription.title.single' })}
          backButton={backButton}
        >
          {() => children}
        </ContentWrapper>
      )
    }

    if (
      error &&
      error.graphQLErrors.length > 0 &&
      error.graphQLErrors[0].extensions &&
      error.graphQLErrors[0].extensions
    ) {
      return renderWrapper(
        <div className="w-100 center pt5">
          <Alert
            type="error"
            action={{
              label: intl.formatMessage({
                id: 'subscription.items.notFoundAction',
              }),
              onClick: this.handleGoToSubscriptionsPage,
            }}
            onClose={this.handleCloseAlert}
          >
            <div className="flex flex-grow-1">
              <div className="db-s di-ns">
                {intl.formatMessage({
                  id: `subscription.fetch.${(error.graphQLErrors[0].extensions
                    .error &&
                    error.graphQLErrors[0].extensions.error.statusCode &&
                    error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
                    'timeout'}`,
                })}
              </div>
            </div>
          </Alert>
        </div>
      )
    }

    const cachedSubscriptionQuery = client.readFragment({
      id: buildCacheLocator(
        'vtex.my-orders-app@2.x',
        'GroupedSubscription',
        match.params.subscriptionId
      ),
      fragment: cachedFragment,
    })

    const subscription = cachedSubscriptionQuery || groupedSubscription

    if (!subscription) {
      return renderWrapper(
        <div className="mr0 h4 center w-100 pb5">
          <div>
            <SummarySkeleton />
          </div>
          <div className="flex flex-row-ns flex-column-s">
            <div className="pt6 pr4-ns w-50-ns">
              <DataSkeleton />
            </div>
            <div className="pl4-ns pt6 w-50-ns">
              <ShippingSkeleton />
            </div>
          </div>
          <div className="pt6">
            <PaymentSkeleton />
          </div>
          <div className="pt6 pb3">
            <HistorySkeleton />
          </div>
        </div>
      )
    }

    return renderWrapper(
      <div className="mr0 center w-100 pb5">
        <div>
          <Summary subscription={subscription} />
        </div>
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
    )
  }
}

const subscriptionQuery = {
  name: 'subscriptionData',
  options: props => ({
    variables: {
      orderGroup: props.match.params.subscriptionId,
    },
    errorPolicy: 'all',
  }),
}

ViewSubscription.propTypes = {
  intl: intlShape.isRequired,
  client: PropTypes.object,
  subscriptionData: PropTypes.object,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
}

export default compose(
  withApollo,
  graphql(GetGroupedSubscription, subscriptionQuery)
)(withRouter(injectIntl(ViewSubscription)))
