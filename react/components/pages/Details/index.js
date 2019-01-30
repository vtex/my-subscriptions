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
import SubscriptionsGroupDetailsLoader from './Loader'
import { subscriptionsGroupShape } from '../../../proptypes'
import { cacheLocator } from '../../../utils/cacheLocator'

class SubscriptionsGroupDetailsContainer extends Component {
  state = {
    displayRetry: false,
    displayAlert: true,
  }

  static getDerivedStateFromProps(props) {
    const lastInstance = props.subscriptionsGroup.lastInstance

    if (lastInstance && lastInstance.status === 'PAYMENT_ERROR') {
      return {
        displayRetry: true,
      }
    }

    return null
  }

  componentDidMount = () => {
    this.mounted = true
  }

  componentWillUnmount = () => {
    this.mounted = false
  }

  handleSetDisplayRetry = displayRetry => {
    this.setState({ displayRetry })
  }

  handleSetDisplayAlert = displayAlert => {
    this.setState({ displayAlert })
  }

  handleMakeRetry = () => {
    const { retry, subscriptionsGroup } = this.props

    const lastInstance = subscriptionsGroup.lastInstance

    return retry({
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
        instanceId: lastInstance.id,
      },
    }).then(() => {
      this.mounted && this.handleSetDisplayRetry(true)
    })
  }

  render() {
    const { subscriptionsGroup, intl } = this.props
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
                    onClick: this.handleMakeRetry,
                  }}
                  onClose={() => this.handleSetDisplayAlert(false)}>
                  {intl.formatMessage({
                    id: 'subscription.alert.error.message',
                  })}
                </Alert>
              </div>
            )}
            <Summary subscriptionsGroup={subscriptionsGroup} />
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <DataCard subscriptionsGroup={subscriptionsGroup} />
              </div>
              <div className="pl4-ns pt6 w-50-ns">
                <Shipping subscriptionsGroup={subscriptionsGroup} />
              </div>
            </div>
            <div className="pt6">
              <Payment
                subscriptionsGroup={subscriptionsGroup}
                onMakeRetry={this.handleMakeRetry}
                displayRetry={displayRetry}
              />
            </div>
            <div className="pt6 mb8">
              <History instances={subscriptionsGroup.instances} />
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
      orderGroup: props.match.params.orderGroup,
    },
    errorPolicy: 'all',
  }),
}

SubscriptionsGroupDetailsContainer.propTypes = {
  intl: intlShape.isRequired,
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
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
      id: cacheLocator.groupedSubscription(match.params.orderGroup),
      fragment: CACHED_FRAGMENT,
    }),
  })),
  withProps(({ data, cachedSubscriptionQuery }) => ({
    subscriptionsGroup: cachedSubscriptionQuery || data.groupedSubscription,
  })),
  branch(
    ({ subscriptionsGroup }) => !subscriptionsGroup,
    renderComponent(SubscriptionsGroupDetailsLoader)
  )
)

export default enhance(SubscriptionsGroupDetailsContainer)

export function headerConfig({ intl }) {
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
