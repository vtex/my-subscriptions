import React, { Component, ErrorInfo } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { withRouter } from 'vtex.my-account-commons/Router'
import { Query } from 'react-apollo'
import { compose } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Dropdown } from 'vtex.styleguide'
import { SubscriptionsGroup as Group } from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import GROUPS from '../../../graphql/customerSubscriptions.gql'
import {
  SubscriptionDisplayFilterEnum,
  CSS,
  SubscriptionStatus,
  Periodicity,
} from '../../../constants'
import { convertFilter } from '../../../utils'
import { logError, logGraphqlError } from '../../../tracking'
import Loading from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import Images from './Images'
import Summary from './Summary'

function isEmpty(data: QueryResult) {
  if (!data.groups || data.groups.length === 0) {
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

class SubscriptionsGroupListContainer extends Component<
  Props & InjectedIntlProps
> {
  public state = {
    filter: SubscriptionDisplayFilterEnum.Active,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error,
      errorInfo,
      runtime: this.props.runtime,
      instance: INSTANCE,
    })
  }

  private handleGoToDetails = (subscriptionsGroupId: string) => {
    this.props.history.push(`/subscriptions/${subscriptionsGroupId}`)
  }

  private handleChangeFilter = (
    _: unknown,
    filter: SubscriptionDisplayFilterEnum
  ) => {
    this.setState({ filter })
  }

  public render() {
    const { intl } = this.props
    const { filter } = this.state

    const filterLabel = intl.formatMessage(messages.filterLabel)
    const filterOptions = [
      {
        label: intl.formatMessage(messages.activeFilter),
        value: SubscriptionDisplayFilterEnum.Active,
      },
      {
        label: intl.formatMessage(messages.canceledFilter),
        value: SubscriptionDisplayFilterEnum.Canceled,
      },
    ]

    const headerContent = (
      <div className="w5">
        <Dropdown
          label={filterLabel}
          size="large"
          options={filterOptions}
          value={filter}
          onChange={this.handleChangeFilter}
        />
      </div>
    )

    const headerConfig = {
      headerContent,
      namespace: 'vtex-account__subscriptions-list',
      titleId: messages.title.id,
    }

    const resultFilter = convertFilter(filter)
    const variables = { statusList: resultFilter }

    return (
      <ContentWrapper {...headerConfig}>
        {() => (
          <Query<QueryResult> query={GROUPS} variables={variables}>
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

              return data.groups.map((group) => (
                <article
                  className={CSS.subscriptionGroupItemWrapper}
                  key={group.id}
                >
                  <Images
                    skus={group.subscriptions.map(
                      (subscription) => subscription.sku
                    )}
                  />
                  <Summary
                    group={group}
                    onGoToDetails={this.handleGoToDetails}
                  />
                </article>
              ))
            }}
          </Query>
        )}
      </ContentWrapper>
    )
  }
}

export type SubscriptionsGroup = Pick<
  Group,
  'id' | 'name' | 'nextPurchaseDate' | 'lastStatusUpdate'
> & {
  status: SubscriptionStatus
  plan: {
    frequency: {
      periodicity: Periodicity
      interval: number
    }
  }
  subscriptions: Array<{
    sku: {
      imageUrl: string
      name: string
      detailUrl: string
      productName: string
    }
  }>
  purchaseSettings: {
    purchaseDay: string
  }
}

interface QueryResult {
  groups: SubscriptionsGroup[]
}

interface Props extends InjectedIntlProps, InjectedRuntimeContext {
  history: any
}

const enhance = compose<Props, {}>(injectIntl, withRouter, withRuntimeContext)

export default enhance(SubscriptionsGroupListContainer)
