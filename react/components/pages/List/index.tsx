import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import { compose } from 'recompose'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Dropdown } from 'vtex.styleguide'
import { SubscriptionsGroup as Group } from 'vtex.subscriptions-graphql'

import GROUPS from '../../../graphql/customerSubscriptions.gql'
import {
  SubscriptionDisplayFilterEnum,
  CSS,
  SubscriptionStatus,
  Periodicity,
} from '../../../constants'
import { convertFilter } from '../../../utils'
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

class SubscriptionsGroupListContainer extends Component<
  Props & InjectedIntlProps
> {
  public state = {
    filter: SubscriptionDisplayFilterEnum.Active,
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

    const filterLabel = intl.formatMessage({ id: 'subscription.list.display' })
    const filterOptions = [
      {
        label: intl.formatMessage({
          id: `subscription.list.display.${SubscriptionDisplayFilterEnum.Active.toLowerCase()}`,
        }),
        value: SubscriptionDisplayFilterEnum.Active,
      },
      {
        label: intl.formatMessage({
          id: `subscription.list.display.${SubscriptionDisplayFilterEnum.Canceled.toLowerCase()}`,
        }),
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
      titleId: 'subscription.title.list',
    }

    const resultFilter = convertFilter(filter)

    return (
      <ContentWrapper {...headerConfig}>
        {() => (
          <Query<QueryResult>
            query={GROUPS}
            variables={{ statusList: resultFilter }}
          >
            {({ error, loading, refetch, data }) => {
              if (loading) return <Loading />
              if (error) return <ErrorState refetch={refetch} />
              if (!data || isEmpty(data)) return <EmptyState />

              return data.groups.map(group => (
                <article
                  className={CSS.subscriptionGroupItemWrapper}
                  key={group.id}
                >
                  <Images
                    skus={group.subscriptions.map(
                      subscription => subscription.sku
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
  subscriptions: {
    sku: {
      imageUrl: string
      name: string
      detailUrl: string
      productName: string
    }
  }[]
  purchaseSettings: {
    purchaseDay: string
  }
}

interface QueryResult {
  groups: SubscriptionsGroup[]
}

interface Props extends InjectedIntlProps {
  history: any
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter
)

export default enhance(SubscriptionsGroupListContainer)
