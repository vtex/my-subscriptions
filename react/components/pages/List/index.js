import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'

import EmptySubscriptions from './EmptyState'
import SubscriptionsListLoading from './Loading'
import Subscription from './Subscription'
import GET_GROUPED_SUBSCRIPTIONS from '../../../graphql/getGroupedSubscriptions.gql'

export const headerConfig = {
  titleId: 'subscription.title.list',
  namespace: 'vtex-account__subscriptions-list',
}

const renderWrapper = children => {
  return <ContentWrapper {...headerConfig}>{() => children}</ContentWrapper>
}

const renderEmptySubscriptions = () => {
  return renderWrapper(<EmptySubscriptions />)
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

class SubscriptionsListContainer extends Component {
  render() {
    const { subscriptions } = this.props

    return renderWrapper(
      <div className="mr0 w-100">
        {subscriptions.map(subscription => {
          return (
            <Subscription
              key={subscription.orderGroup}
              subscription={subscription}
            />
          )
        })}
      </div>
    )
  }
}

const subscriptionsQuery = {
  options: {
    notifyOnNetworkStatusChange: true,
  },
}

SubscriptionsListContainer.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.object),
}

const enhance = compose(
  graphql(GET_GROUPED_SUBSCRIPTIONS, subscriptionsQuery),
  branch(
    ({ data }) => !data.groupedSubscriptions || data.loading,
    renderComponent(SubscriptionsListLoading)
  ),
  withProps(({ data }) => ({ subscriptions: data.groupedSubscriptions })),
  branch(
    ({ subscriptions }) => !subscriptions || subscriptions.length === 0,
    renderComponent(renderEmptySubscriptions)
  )
)

export default enhance(SubscriptionsListContainer)
