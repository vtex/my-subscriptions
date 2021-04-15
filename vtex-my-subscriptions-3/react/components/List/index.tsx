import React, { Component, ErrorInfo } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { Query } from 'react-apollo'
import { compose } from 'recompose'
import { Dropdown, Button, PageHeader as Header } from 'vtex.styleguide'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import QUERY, {
  Result,
  Subscription,
} from '../../graphql/queries/subscriptions.gql'
import { SubscriptionDisplayFilter, CSS, convertFilter } from './utils'
import { logError, logGraphQLError, getRuntimeInfo } from '../../tracking'
import Loading from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import Images from './Images'
import Summary from './Summary'

function isEmpty(data: Result) {
  if (!data.list || data.list.length === 0) {
    return true
  }

  return false
}

const messages = defineMessages({
  filterLabel: { id: 'subscription.list.display' },
  activeFilter: {
    id: 'subscription.list.display.active_filter',
  },
  canceledFilter: {
    id: 'subscription.list.display.canceled_filter',
  },
  title: {
    id: 'subscription.title.list',
  },
  createButton: {
    id: 'list-page.create-subscriptions',
  },
  back: {
    id: 'list-page.back',
  },
})

const INSTANCE = 'SubscriptionsList'

class SubscriptionsListContainer extends Component<
  Props & WrappedComponentProps,
  { filter: SubscriptionDisplayFilter }
> {
  public state = {
    filter: 'ACTIVE_FILTER' as SubscriptionDisplayFilter,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error: {
        ...error,
        ...errorInfo,
      },
      runtimeInfo: getRuntimeInfo(this.props.runtime),
      instance: INSTANCE,
    })
  }

  private handleGoToDetails = (subscriptionId: string) => {
    this.props.history.push(`/subscriptions/${subscriptionId}`)
  }

  private handleChangeFilter = (
    _: unknown,
    filter: SubscriptionDisplayFilter
  ) => {
    this.setState({ filter })
  }

  public render() {
    const { intl, history } = this.props
    const { filter } = this.state

    const filterLabel = intl.formatMessage(messages.filterLabel)
    const filterOptions = [
      {
        label: intl.formatMessage(messages.activeFilter),
        value: 'ACTIVE_FILTER',
      },
      {
        label: intl.formatMessage(messages.canceledFilter),
        value: 'CANCELED_FILTER',
      },
    ]

    const resultFilter = convertFilter(filter)
    const variables = { filter: resultFilter }

    const headerContent = (
      <Button onClick={() => history.push('/subscriptions-new')}>
        {intl.formatMessage(messages.createButton)}
      </Button>
    )

    return (
      <>
        <div className="db dn-ns">
          <Header
            title={
              <span className="normal">
                {intl.formatMessage(messages.title)}
              </span>
            }
            linkLabel={intl.formatMessage(messages.back)}
            onLinkClick={() => history.push('/')}
          >
            {headerContent}
          </Header>
        </div>
        <div className="db-ns dn">
          <Header
            title={
              <span className="normal">
                {intl.formatMessage(messages.title)}
              </span>
            }
          >
            {headerContent}
          </Header>
        </div>
        <div className="pa5 pa7-ns">
          <div className="w5 mb7">
            <Dropdown
              label={filterLabel}
              size="large"
              options={filterOptions}
              value={filter}
              onChange={this.handleChangeFilter}
            />
          </div>
          <Query<Result>
            query={QUERY}
            variables={variables}
            fetchPolicy="cache-and-network"
          >
            {({ error, loading, refetch, data }) => {
              if (loading) return <Loading />
              if (error) {
                logGraphQLError({
                  error,
                  variables,
                  type: 'QueryError',
                  instance: INSTANCE,
                  runtimeInfo: getRuntimeInfo(this.props.runtime),
                })
                return <ErrorState refetch={refetch} />
              }
              if (!data || isEmpty(data)) return <EmptyState />

              return (
                <>
                  {data.list.map((subscription) => (
                    <article
                      className={CSS.subscriptionItemWrapper}
                      key={subscription.id}
                    >
                      <Images
                        skus={subscription.items.map((item) => item.sku)}
                      />
                      <Summary
                        subscription={subscription}
                        onGoToDetails={this.handleGoToDetails}
                      />
                    </article>
                  ))}
                </>
              )
            }}
          </Query>
        </div>
      </>
    )
  }
}

type Props = WrappedComponentProps &
  InjectedRuntimeContext &
  RouteComponentProps

const enhance = compose<Props, {}>(injectIntl, withRouter, withRuntimeContext)

export { Subscription }

export default enhance(SubscriptionsListContainer)
