import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose, branch, renderComponent } from 'recompose'
import InfiniteScroll from 'react-infinite-scroller'

import { SubscriptionOrderStatus } from '../../../../constants'
import SUBSCRIPTION_ORDERS_BY_GROUP from '../../../../graphql/subscriptionOrdersByGroup.gql'

import HistoryItem from './HistoryItem'
import HistoryItemsSkeleton from './HistoryItemsSkeleton'
import style from './style.css'
import HistoryEmpty from './HistoryEmpty'

import { SubscriptionsGroup } from '..'

class HistoryList extends Component<Props> {
  public state = {
    page: 1,
  }

  private getNextPage = () => {
    const { perPage, totalCount } = this.props
    const { page: currentPage } = this.state

    const totalPages = Math.ceil(totalCount / perPage)
    return currentPage < totalPages ? currentPage + 1 : null
  }

  private loadMore = () => {
    const { fetchMore } = this.props

    const nextPage = this.getNextPage()

    if (nextPage == null) return

    return fetchMore({
      variables: {
        page: nextPage,
      },
      updateQuery(prev: any, { fetchMoreResult }: any) {
        return {
          ...prev,
          orders: {
            ...prev.orders,
            list: [...prev.orders.list, ...fetchMoreResult.orders.list],
          },
        }
      },
    }).then(() => {
      this.setState({ page: nextPage })
    })
  }

  public render() {
    const { perPage, orders } = this.props

    if (!orders) return <HistoryItemsSkeleton numberOfItems={perPage} />

    const hasNextPage = this.getNextPage() != null

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
        {orders.map((order: SubscriptionOrder, i: number) => (
          <HistoryItem key={`${i}_${order.date}`} order={order} />
        ))}
      </InfiniteScroll>
    )
  }
}

interface OuterProps {
  group: SubscriptionsGroup
  perPage: number
}

export interface SubscriptionOrder {
  id: string
  status: SubscriptionOrderStatus
  date: string
}

interface ChildProps {
  orders: SubscriptionOrder[]
  totalCount: number
  loading: boolean
  fetchMore: (args: any) => any
}

type Props = OuterProps & ChildProps

const enhance = compose<Props, OuterProps>(
  graphql<
    OuterProps,
    { orders: { list: SubscriptionOrder[]; totalCount: number } },
    { subscriptionsGroupId: string; page: number; perPage: number },
    ChildProps
  >(SUBSCRIPTION_ORDERS_BY_GROUP, {
    options: ({ group, perPage }) => ({
      variables: {
        subscriptionsGroupId: group.id,
        page: 1,
        perPage,
      },
    }),
    props: ({ data }) =>
      data && data.orders
        ? {
            orders: data.orders.list,
            totalCount: data.orders.totalCount,
            loading: data.loading,
            fetchMore: data.fetchMore,
          }
        : {
            orders: [],
            totalCount: 0,
            loading: false,
            fetchMore: () => null,
          },
  }),
  branch<ChildProps>(
    ({ loading }) => loading,
    renderComponent(({ perPage }: OuterProps) => (
      <HistoryItemsSkeleton numberOfItems={perPage} />
    ))
  ),
  branch(
    ({ orders }: ChildProps) => orders.length === 0,
    renderComponent(HistoryEmpty)
  )
)

export default enhance(HistoryList)
