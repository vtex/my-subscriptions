import React, { Component, ErrorInfo } from 'react'
import { compose } from 'recompose'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import DETAILS_PAGE_QUERY, {
  Subscription,
  Item,
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/detailsPage.gql'
import { logError, queryWrapper } from '../../tracking'
import Header from './PageHeader'

export const INSTANCE = 'SubscriptionsDetails'

class SubscriptionsDetailsContainer extends Component<Props> {
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error,
      errorInfo,
      runtime: this.props.runtime,
      instance: INSTANCE,
    })
  }

  public render() {
    const { subscription, orderformId } = this.props

    if (!subscription) return null

    return (
      <>
        <Header
          name={subscription.name}
          status={subscription.status}
          subscriptionId={subscription.id}
          orderFormId={orderformId}
          skus={subscription.items.map((item) => ({
            id: item.sku.id,
            quantity: item.quantity,
            detailUrl: item.sku.detailUrl,
            name: item.sku.name,
          }))}
          isSkipped={subscription.isSkipped}
        />
      </>
    )
  }
}

interface Props
  extends WrappedComponentProps,
    ChildProps,
    InjectedRuntimeContext {}

type InputProps = RouteComponentProps<{ subscriptionId: string }> &
  InjectedRuntimeContext

interface ChildProps {
  loading: boolean
  subscription?: Subscription
  orderformId?: string
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  withRuntimeContext,
  queryWrapper<InputProps, Result, QueryArgs, ChildProps>(
    INSTANCE,
    DETAILS_PAGE_QUERY,
    {
      options: (input) => ({
        variables: {
          id: input.match.params.subscriptionId,
        },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        subscription: data?.subscription,
        orderformId: data?.orderForm?.orderFormId,
      }),
    }
  )
)

export { Subscription, Item }

export default enhance(SubscriptionsDetailsContainer)
