import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'

import EmptySubscriptionsGroupList from './EmptyState'
import SubscriptionsGroupListLoading from './Loading'
import SubscriptionGroup from './SubscriptionsGroup'
import GET_GROUPED_SUBSCRIPTIONS from '../../../graphql/getGroupedSubscriptions.gql'

class SubscriptionsGroupListContainer extends Component {
  render() {
    const { subscriptionsGroups } = this.props

    return renderWrapper(
      <div className="mr0 w-100">
        {subscriptionsGroups.map(group => {
          return (
            <SubscriptionGroup
              key={group.orderGroup}
              subscriptionsGroup={group}
            />
          )
        })}
      </div>
    )
  }
}

SubscriptionsGroupListContainer.propTypes = {
  subscriptionsGroups: PropTypes.arrayOf(PropTypes.object),
}

const enhance = compose(
  graphql(GET_GROUPED_SUBSCRIPTIONS),
  branch(
    ({ data }) => !data.groupedSubscriptions || data.loading,
    renderComponent(SubscriptionsGroupListLoading)
  ),
  withProps(({ data }) => ({ subscriptionsGroups: data.groupedSubscriptions })),
  branch(
    ({ subscriptionsGroups }) =>
      !subscriptionsGroups || subscriptionsGroups.length === 0,
    renderComponent(renderEmptySubscriptions)
  )
)

export default enhance(SubscriptionsGroupListContainer)

function renderWrapper(children) {
  return <ContentWrapper {...headerConfig}>{() => children}</ContentWrapper>
}

function renderEmptySubscriptions() {
  return renderWrapper(<EmptySubscriptionsGroupList />)
}

export const headerConfig = {
  titleId: 'subscription.title.list',
  namespace: 'vtex-account__subscriptions-list',
}
