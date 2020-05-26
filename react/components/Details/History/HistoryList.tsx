import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import InfiniteScroll from 'react-infinite-scroller'

import SUBSCRIPTION_ORDERS, {
  Result,
  Args,
  SubscriptionOrder,
} from '../../../graphql/queries/subscriptionOrders.gql'
import HistoryItem from './HistoryItem'
import HistoryItemsSkeleton from './HistoryItemsSkeleton'
import style from './style.css'
import HistoryEmpty from './HistoryEmpty'
import { Subscription } from '..'
import { queryWrapper } from '../../../tracking'

const INSTANCE = 'SubscriptionsDetails/SubscriptionsOrdersList'

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
  subscription: Subscription
  perPage: number
}

interface ChildProps {
  orders: SubscriptionOrder[]
  totalCount: number
  loading: boolean
  fetchMore: (args: any) => any
}

type Props = OuterProps & ChildProps

const enhance = compose<Props, OuterProps>(
  queryWrapper<OuterProps, Result, Args, ChildProps>(
    INSTANCE,
    SUBSCRIPTION_ORDERS,
    {
      options: ({ subscription, perPage }) => ({
        variables: {
          subscriptionId: subscription.id,
          page: 1,
          perPage,
        },
      }),
      props: ({ data }) =>
        data?.orders
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
    }
  ),
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

export { SubscriptionOrder }

export default enhance(HistoryList)
