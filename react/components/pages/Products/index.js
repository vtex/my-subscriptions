import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql, withApollo } from 'react-apollo'
import { buildCacheLocator } from 'render'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Link } from 'react-router-dom'
import { EmptyState, Button } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'

import Item from '../../commons/Item'
import ViewItemsSkeleton from '../../commons/ViewItemsSkeleton'
import GetGroupedSubscription from '../../../graphql/getGroupedSubscription.gql'
import cachedFragment from '../../../graphql/fragmentGroupedSubscription.gql'

const headerConfig = ({ intl, orderGroup }) => {
  const backButton = {
    title: intl.formatMessage({ id: 'subscription.title.single' }),
    path: `/subscriptions/${orderGroup}`,
  }
  return {
    backButton,
    title: intl.formatMessage({ id: 'subscription.title.single' }),
    namespace: 'vtex-account__subscription-products',
  }
}

class SubscriptionProductsContainer extends Component {
  render() {
    const { subscriptionData, intl, client, match } = this.props
    const { groupedSubscription, error, loading } = subscriptionData

    const cachedSubscriptionQuery = client.readFragment({
      id: buildCacheLocator(
        `${process.env.VTEX_APP_ID}`,
        'GroupedSubscription',
        match.params.orderGroup
      ),
      fragment: cachedFragment,
    })

    const subscription = cachedSubscriptionQuery || groupedSubscription

    const renderWrapper = children => {
      return (
        <ContentWrapper
          {...headerConfig({
            intl,
            orderGroup: match.params.orderGroup,
          })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (loading || !subscription) return renderWrapper(<ViewItemsSkeleton />)

    if (subscription.items == null || error) {
      return renderWrapper(
        <EmptyState
          title={intl.formatMessage({
            id: 'subscription.items.notFound',
          })}>
          <p>
            {intl.formatMessage({
              id: 'subscription.items.notFoundHelperText',
            })}
          </p>
          <div className="pt5">
            <Button variation="secondary" size="small">
              <Link to={'/subscriptions'}>
                <span className="flex align-baseline no-underline">
                  {intl.formatMessage({
                    id: 'subscription.items.notFoundAction',
                  })}
                </span>
              </Link>
            </Button>
          </div>
        </EmptyState>
      )
    }

    return renderWrapper(
      <div className="w-100 center pb6">
        {subscription.items.map(item => {
          return (
            <Item
              key={item.id}
              item={item}
              orderGroup={subscription.orderGroup}
              subscription={subscription}
              currency={subscription.purchaseSettings.currencySymbol}
            />
          )
        })}
      </div>
    )
  }
}

const subscriptionQuery = {
  name: 'subscriptionData',
  options: props => ({
    variables: {
      orderGroup: props.match.params.orderGroup,
    },
  }),
}

SubscriptionProductsContainer.propTypes = {
  intl: intlShape.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  client: PropTypes.object,
  subscriptionData: PropTypes.object,
}

export default compose(
  withApollo,
  graphql(GetGroupedSubscription, subscriptionQuery)
)(injectIntl(SubscriptionProductsContainer))
