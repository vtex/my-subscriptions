import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import InfiniteScroll from 'react-infinite-scroller'

import type {
  Result,
  Args,
} from '../../../graphql/queries/subscriptionExecutions.gql'
import QUERY, {
  SubscriptionExecution,
} from '../../../graphql/queries/subscriptionExecutions.gql'
import HistoryItem from './HistoryItem'
import HistoryItemsSkeleton from './HistoryItemsSkeleton'
import style from './style.css'
import HistoryEmpty from './HistoryEmpty'
import { withQueryWrapper, getRuntimeInfo } from '../../../tracking'

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
      updateQuery(
        prev: {
          executions: { list: SubscriptionExecution[]; totalCount: number }
        },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: {
            executions: { list: SubscriptionExecution[]; totalCount: number }
          }
        }
      ) {
        console.info(`prev`, prev)
        console.info(`fetchMoreResult`, fetchMoreResult)

        if (!fetchMoreResult) return prev

        return {
          ...prev,
          executions: {
            ...prev.executions,
            list: [...prev.executions.list, ...fetchMoreResult.executions.list],
            totalCount: fetchMoreResult.executions.totalCount,
          },
        }
      },
    }).then(() => {
      this.setState({ page: nextPage })
    })
  }

  public render() {
    const { perPage, executions } = this.props

    if (!executions) return <HistoryItemsSkeleton numberOfItems={perPage} />

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
        {executions.map((execution: SubscriptionExecution, i: number) => (
          <HistoryItem key={`${i}_${execution.date}`} execution={execution} />
        ))}
      </InfiniteScroll>
    )
  }
}

interface OuterProps {
  subscriptionId: string
  perPage: number
}

type FetchArgs = {
  variables: {
    page: number
  }
  updateQuery(
    prev: { executions: { list: SubscriptionExecution[]; totalCount: number } },
    fetchMoreResult: {
      fetchMoreResult?: {
        executions: { list: SubscriptionExecution[]; totalCount: number }
      }
    }
  ): { executions: { list: SubscriptionExecution[]; totalCount: number } }
}

interface ChildProps {
  executions: SubscriptionExecution[]
  totalCount: number
  loading: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: (args: FetchArgs) => Promise<any>
}

type Props = OuterProps & ChildProps

const enhance = compose<Props, OuterProps>(
  withQueryWrapper<OuterProps, Result, Args, ChildProps>({
    getRuntimeInfo,
    workflowInstance: INSTANCE,
    document: QUERY,
    operationOptions: {
      options: ({ subscriptionId, perPage }) => ({
        variables: {
          subscriptionId,
          page: 1,
          perPage,
        },
      }),
      props: ({ data }) =>
        data?.executions
          ? {
              executions: data.executions.list,
              totalCount: data.executions.totalCount,
              loading: data.loading,
              fetchMore: data.fetchMore,
            }
          : {
              executions: [],
              totalCount: 0,
              loading: true,
              fetchMore: () => Promise.resolve(null), // Ajuste aqui para retornar Promise
            },
    },
  }),
  branch<ChildProps>(
    ({ loading }) => loading,
    renderComponent(({ perPage }: OuterProps) => (
      <HistoryItemsSkeleton numberOfItems={perPage} />
    ))
  ),
  branch(
    ({ executions }: ChildProps) => executions.length === 0,
    renderComponent(HistoryEmpty)
  )
)

export { SubscriptionExecution }

export default enhance(HistoryList)
