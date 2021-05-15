declare module '*/subscriptionExecutions.gql' {
  import { DocumentNode } from 'graphql'
  import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

  interface SubscriptionExecution {
    id: string
    status: SubscriptionExecutionStatus
    date: string
    order: Order
  }

  interface Result {
    executions: { list: SubscriptionExecution[]; totalCount: number }
  }

  interface Args {
    subscriptionId: string
    page: number
    perPage: number
  }

  interface ItemLogistics {
    shippingEstimateDate: string
  }

  interface ShippingData {
    logisticsInfo: Array<!ItemLogistics>
  }
  interface Package {
    trackingUrl: string
  }
  interface PackageAttachment {
    packages: Array<!Package>
  }

  interface Order {
    orderId: string
    packageAttachment: !PackageAttachment
    shippingData: !ShippingData
    status: string
  }

  export { SubscriptionExecution, Result, Args }

  const value: DocumentNode
  export default value
}
