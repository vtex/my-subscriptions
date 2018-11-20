import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'

import GET_GROUPED_SUBSCRIPTIONS from '../graphql/getGroupedSubscriptions.gql'
import EmptyState from '../components/EmptyState'
import SubscriptionsListLoading from '../components/loaders/SubscriptionsListLoading'

export const headerConfig = {
  titleId: 'subscription.title.list',
}

export const parseError = error => {
  if (
    error &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions &&
    error.graphQLErrors[0].extensions
  ) {
    return `subscription.fetch.${(error.graphQLErrors[0].extensions.error &&
      error.graphQLErrors[0].extensions.error.statusCode &&
      error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
      'timeout'}`
  }
}

class SubscriptionsList extends Component {
  render() {
    const { subscriptions } = this.props

    const renderWrapper = children => {
      return <ContentWrapper {...headerConfig}>{() => children}</ContentWrapper>
    }

    if (subscriptions.length === 0) {
      return renderWrapper(
        <div className="mr0 pt5 pl2 w-100 tc">
          <EmptyState />
        </div>
      )
    }

    return renderWrapper(
      <div className="mr0 w-100">
        <span>teste</span>
        {/* {subscriptions.map(subscription => {
          return (
            <Subscription
              key={subscription.orderGroup}
              subscription={subscription}
            />
          )
        })} */}
      </div>
    )
  }
}

const subscriptionsQuery = {
  options: {
    notifyOnNetworkStatusChange: true,
  },
}

SubscriptionsList.propTypes = {
  data: PropTypes.object,
}

const enhance = compose(
  graphql(GET_GROUPED_SUBSCRIPTIONS, subscriptionsQuery),
  branch(({ data }) => data.loading, renderComponent(SubscriptionsListLoading)),
  withProps(({ data }) => ({ subscriptions: data.groupedSubscriptions }))
)
export default enhance(SubscriptionsList)
