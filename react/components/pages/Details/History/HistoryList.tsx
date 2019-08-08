import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, FormattedMessage } from 'react-intl'
import { compose } from 'recompose'
import InfiniteScroll from 'react-infinite-scroller'

import HistoryItem from './HistoryItem'
import HistoryItemsSkeleton from './HistoryItemsSkeleton'

import SUBSCRIPTION_ORDERS_BY_GROUP from '../../../../graphql/subscriptionOrdersByGroup.gql'
import style from './style.css'

interface OuterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  perPage: number
}

interface InnerProps extends InjectedIntlProps {
  data: any
}

class HistoryList extends Component<OuterProps & InnerProps> {
  state = {
    page: 1,
  }

  getNextPage = () => {
    const {
      perPage,
      data: {
        subscriptionOrdersByGroup: { totalCount },
      },
    } = this.props
    const { page: currentPage } = this.state

    const totalPages = Math.ceil(totalCount / perPage)
    return currentPage < totalPages ? currentPage + 1 : null
  }

  loadMore = () => {
    const {
      data: { fetchMore },
    } = this.props

    const nextPage = this.getNextPage()

    if (nextPage == null) return

    return fetchMore({
      variables: {
        page: nextPage,
      },
      updateQuery(prev: any, { fetchMoreResult }: any) {
        return {
          ...prev,
          subscriptionOrdersByGroup: {
            ...prev.subscriptionOrdersByGroup,
            list: [
              ...prev.subscriptionOrdersByGroup.list,
              ...fetchMoreResult.subscriptionOrdersByGroup.list,
            ],
          },
        }
      },
    }).then(() => {
      this.setState({ page: nextPage })
    })
  }

  render() {
    const {
      perPage,
      data: { subscriptionOrdersByGroup },
    } = this.props

    if (!subscriptionOrdersByGroup)
      return <HistoryItemsSkeleton numberOfItems={perPage} />

    const { list } = subscriptionOrdersByGroup
    const hasNextPage = this.getNextPage() != null

    if (list.length === 0) {
      return (
        <div className="tc">
          <div className="mt5 lh-copy f5 serious-black">
            <FormattedMessage id="store/subscription.order.no-order" />
          </div>
          <div className="lh-title f6 c-muted-1">
            <FormattedMessage id="store/subscription.order.awaiting-first-cycle" />
          </div>
        </div>
      )
    }

    return (
      <InfiniteScroll
        element="ul"
        className={`${style.historyList} ${
          !hasNextPage ? style.isFullyloaded : ''
        }`}
        pageStart={1}
        threshold={50}
        loadMore={this.loadMore}
        hasMore={hasNextPage}
        useWindow={false}
        loader={<HistoryItemsSkeleton numberOfItems={1} key={1} />}
      >
        {list.map((order: any, i: number) => (
          <HistoryItem key={`${i}_${order.date}`} order={order} />
        ))}
      </InfiniteScroll>
    )
  }
}

const enhance = compose<InnerProps & OuterProps, OuterProps>(
  graphql(SUBSCRIPTION_ORDERS_BY_GROUP, {
    options({ subscriptionsGroup, perPage }: OuterProps) {
      return {
        variables: {
          orderGroup: subscriptionsGroup.orderGroup,
          page: 1,
          perPage,
        },
      }
    },
  })
)

export default enhance(HistoryList)
