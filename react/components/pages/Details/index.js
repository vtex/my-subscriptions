import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { injectIntl, intlShape } from 'react-intl'
import { graphql, withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Alert } from 'vtex.styleguide'

import GET_GROUPED_SUBSCRIPTION from '../../../graphql/getGroupedSubscription.gql'
import CACHED_FRAGMENT from '../../../graphql/fragmentGroupedSubscription.gql'
import RETRY_MUTATION from '../../../graphql/retryMutation.gql'
import DataCard from './DataCard/DataCardContainer'
import Summary from './Summary'
import Payment from './Payment'
import History from './History'
import Shipping from './Shipping'
import SubscriptionDetailsLoader from './Loader'
import { subscriptionShape } from '../../../proptypes'
import { cacheLocator } from '../../../utils/cacheLocator'
import { getLastInstance } from '../../../utils'
import { throws } from 'assert'

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

class SubscriptionDetailsContainer extends Component {
  state = {
    displayRetry: false,
    displayAlert: true,
  }

  static getDerivedStateFromProps(props) {
    const lastInstance = getLastInstance(props.subscription.instances)

    if (lastInstance.status === 'PAYMENT_ERROR') {
      return {
        displayRetry: true,
      }
    }

    return null
  }

  handleSetDisplayRetry = displayRetry => {
    this.setState({ displayRetry })
  }

  handleSetDisplayAlert = displayAlert => {
    this.setState({ displayAlert })
  }

  handleMakeRetry = () => {
    const { retry, subscription } = this.props

    const lastInstance = getLastInstance(subscription.instances)

    return retry({
      variables: {
        orderGroup: subscription.orderGroup,
        workflowId: lastInstance.workflowId,
        instanceId: lastInstance.id,
      },
    }).then(() => {
      this.handleSetDisplayRetry(true)
    })
  }

  render() {
    const { subscription, intl } = this.props
    const { displayRetry, displayAlert } = this.state

    return (
      <ContentWrapper {...headerConfig({ intl })}>
        {() => (
          <div className="mr0 center w-100 pb5">
            {displayRetry && displayAlert && (
              <div className="mb5">
                <Alert
                  type="error"
                  action={{
                    label: intl.formatMessage({
                      id: 'subscription.retry.button.message',
                    }),
                    onClick: () => this.handleMakeRetry(),
                  }}
                  onClose={() => this.handleSetDisplayAlert(false)}>
                  {intl.formatMessage({
                    id: 'subscription.alert.error.message',
                  })}
                </Alert>
              </div>
            )}
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
              <Payment
                subscription={subscription}
                onMakeRetry={this.handleMakeRetry}
                displayRetry={displayRetry}
              />
            </div>
            <div className="pt6 mb8">
              <History instances={subscription.instances} />
            </div>
          </div>
        )}
      </ContentWrapper>
    )
  }
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
  retry: PropTypes.func.isRequired,
}

const enhance = compose(
  injectIntl,
  withRouter,
  withApollo,
  graphql(GET_GROUPED_SUBSCRIPTION, subscriptionQuery),
  graphql(RETRY_MUTATION, { name: 'retry' }),
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
