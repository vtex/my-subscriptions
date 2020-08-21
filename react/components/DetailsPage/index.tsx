import React, { Component, ErrorInfo } from 'react'
import { compose } from 'recompose'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import SUBSCRIPTION, {
  Subscription,
  Item,
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/subscription.gql'
import { logError, queryWrapper } from '../../tracking'

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
    const { subscription } = this.props

    if (!subscription) return null

    return <>hey</>
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
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  withRuntimeContext,
  queryWrapper<InputProps, Result, QueryArgs, ChildProps>(
    INSTANCE,
    SUBSCRIPTION,
    {
      options: (input) => ({
        variables: {
          id: input.match.params.subscriptionId,
        },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        subscription: data?.subscription,
        data,
      }),
    }
  )
)

export { Subscription, Item }

export default enhance(SubscriptionsDetailsContainer)
