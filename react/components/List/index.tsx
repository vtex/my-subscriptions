import React, { Component, ErrorInfo } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { Query } from 'react-apollo'
import { compose } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Dropdown, Button } from 'vtex.styleguide'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import QUERY, {
  Result,
  Subscription,
} from '../../graphql/queries/subscriptions.gql'
import { SubscriptionDisplayFilter, CSS, convertFilter } from './utils'
import { logError, logGraphqlError } from '../../tracking'
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
  filterLabel: { id: 'store/subscription.list.display', defaultMessage: '' },
  activeFilter: {
    id: 'store/subscription.list.display.active_filter',
    defaultMessage: '',
  },
  canceledFilter: {
    id: 'store/subscription.list.display.canceled_filter',
    defaultMessage: '',
  },
  title: {
    id: 'store/subscription.title.list',
    defaultMessage: '',
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
      error,
      errorInfo,
      runtime: this.props.runtime,
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

    const headerContent = (
      <div>
        <Button size="small" onClick={() => history.push('/subscriptions-new')}>
          {intl.formatMessage({
            id: 'store/list-page.title',
            defaultMessage: 'New subscription',
          })}
        </Button>
        <div className="w-100 mt6">
          <Dropdown
            label={filterLabel}
            size="large"
            options={filterOptions}
            value={filter}
            onChange={this.handleChangeFilter}
          />
        </div>
      </div>
    )

    const headerConfig = {
      headerContent,
      namespace: 'vtex-account__subscriptions-list',
      titleId: messages.title.id,
    }

    const resultFilter = convertFilter(filter)
    const variables = { filter: resultFilter }

    return (
      <ContentWrapper {...headerConfig}>
        {() => (
          <Query<Result> query={QUERY} variables={variables}>
            {({ error, loading, refetch, data }) => {
              if (loading) return <Loading />
              if (error) {
                logGraphqlError({
                  error,
                  variables,
                  type: 'QueryError',
                  instance: INSTANCE,
                  runtime: this.props.runtime,
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
        )}
      </ContentWrapper>
    )
  }
}

type Props = WrappedComponentProps &
  InjectedRuntimeContext &
  RouteComponentProps

const enhance = compose<Props, {}>(injectIntl, withRouter, withRuntimeContext)

export { Subscription }

export default enhance(SubscriptionsListContainer)
