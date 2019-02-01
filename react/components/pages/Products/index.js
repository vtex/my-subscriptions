import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { graphql } from 'react-apollo'
import { compose, withProps } from 'recompose'
import { withRouter, Link } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { EmptyState, Button } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'

import Subscription from './Subscription'
import ViewItemsSkeleton from '../../commons/ViewItemsSkeleton'
import GET_SUBSCRIPTIONS_INFO from '../../../graphql/Products/getSubscriptionsInfo.gql'

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
    const {
      data: { subscriptionsInfo, error, loading },
      intl,
      orderGroup,
    } = this.props

    const renderWrapper = children => {
      return (
        <ContentWrapper
          {...headerConfig({
            intl,
            orderGroup,
          })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (loading || (!subscriptionsInfo && subscriptionsInfo.subscriptions))
      return renderWrapper(<ViewItemsSkeleton />)

    const {
      subscriptions,
      purchaseSettings: { currencySymbol },
    } = subscriptionsInfo

    if (subscriptions == null || error) {
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
        {subscriptions.map(subscription => {
          return (
            <Subscription
              key={subscription.SubscriptionId}
              subscription={subscription}
              orderGroup={orderGroup}
              currency={currencySymbol}
            />
          )
        })}
      </div>
    )
  }
}

const subscriptionsQuery = {
  options: ({ orderGroup }) => ({
    variables: {
      orderGroup,
    },
  }),
}

SubscriptionProductsContainer.propTypes = {
  intl: intlShape.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  orderGroup: PropTypes.string.isRequired,
  data: PropTypes.object,
}

const enhance = compose(
  injectIntl,
  withRouter,
  withProps(({ match }) => ({
    orderGroup: match.params.orderGroup,
  })),
  graphql(GET_SUBSCRIPTIONS_INFO, subscriptionsQuery)
)

export default enhance(SubscriptionProductsContainer)
