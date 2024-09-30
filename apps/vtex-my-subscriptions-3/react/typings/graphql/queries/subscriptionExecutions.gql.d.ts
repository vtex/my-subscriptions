declare module '*/subscriptionExecutions.gql' {
  import type { DocumentNode } from 'graphql'
  import type { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

  interface SubscriptionExecution {
    id: string
    status: SubscriptionExecutionStatus
    date: string
  }

  interface Result {
    executions: { list: SubscriptionExecution[]; totalCount: number }
  }

  interface Args {
    subscriptionId: string
    page: number
    perPage: number
  }

  export { SubscriptionExecution, Result, Args }

  const value: DocumentNode
  export default value
}
