import React, { FunctionComponent } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps } from 'react-intl'
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

const HistoryList: FunctionComponent<OuterProps & InnerProps> = ({
  data,
  perPage,
}) => {
  const { fetchMore, subscriptionOrdersByGroup } = data

  function loadMore() {
    if (subscriptionOrdersByGroup.pagination.nextPage == null) {
      return false
    }

    return fetchMore({
      variables: {
        page: subscriptionOrdersByGroup.pagination.nextPage,
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
            pagination: fetchMoreResult.subscriptionOrdersByGroup.pagination,
          },
        }
      },
    })
  }

  if (!subscriptionOrdersByGroup)
    return <HistoryItemsSkeleton numberOfItems={perPage} />

  const { list, pagination } = subscriptionOrdersByGroup
  const hasNextPage = pagination.nextPage != null

  return (
    <InfiniteScroll
      element="ul"
      className={`${style.historyList} ${
        !hasNextPage ? style.isFullyloaded : ''
      }`}
      pageStart={1}
      threshold={50}
      loadMore={loadMore}
      hasMore={hasNextPage}
      useWindow={false}
      loader={<HistoryItemsSkeleton numberOfItems={1} />}
    >
      {list.map((order: any) => (
        <HistoryItem key={order.date} order={order} />
      ))}
    </InfiniteScroll>
  )
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
