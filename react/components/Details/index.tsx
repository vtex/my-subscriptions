import React, { Component, ErrorInfo } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { ContentWrapper } from 'vtex.my-account-commons'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { Alert } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import SUBSCRIPTION, {
  Subscription,
  Item,
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/subscription.gql'
import RETRY_MUTATION, {
  Args as RetryArgs,
} from '../../graphql/mutations/retry.gql'
import { PAYMENT_DIV_ID } from '../../constants'
import { scrollToElement } from '../../utils'
import DataCard from './DataCard'
import Summary from './Summary'
import Payment from './Payment'
import Shipping from './Shipping'
import History from '../DetailsPage/History'
import Loader from './Loader'
import Products from './Products'
import { logError, logGraphqlError, queryWrapper } from '../../tracking'

export const INSTANCE = 'SubscriptionsDetails'

const messages = defineMessages({
  detailsTitle: { id: 'store/subscription.title.single', defaultMessage: '' },
  listTitle: { id: 'store/subscription.title.list', defaultMessage: '' },
  errorMessageButton: {
    id: 'store/subscription.alert.error.button.message',
    defaultMessage: '',
  },
  errorMessage: {
    id: 'store/subscription.alert.error.message',
    defaultMessage: '',
  },
})

export function headerConfig({ intl }: WrappedComponentProps) {
  const backButton = {
    title: intl.formatMessage(messages.listTitle),
    path: '/subscriptions',
  }

  return {
    backButton,
    title: intl.formatMessage(messages.detailsTitle),
    namespace: 'vtex-account__subscription-details',
  }
}

class SubscriptionsDetailsContainer extends Component<Props> {
  public state = {
    displayRetry: false,
    displayAlert: true,
  }

  private mounted = false

  public static getDerivedStateFromProps(props: Props) {
    const lastExecution = props.subscription && props.subscription.lastExecution

    return lastExecution && lastExecution.status === 'PAYMENT_ERROR'
      ? {
          displayRetry: true,
        }
      : null
  }

  public componentDidMount = () => {
    this.mounted = true
  }

  public componentWillUnmount = () => {
    this.mounted = false
  }

  private handleSetDisplayRetry = (displayRetry: boolean) => {
    this.setState({ displayRetry })
  }

  private handleSetDisplayAlert = (displayAlert: boolean) => {
    this.setState({ displayAlert })
  }

  private handleScrollToPayment = () => scrollToElement(PAYMENT_DIV_ID)

  private handleMakeRetry = () => {
    const { retry, subscription } = this.props

    const variables = {
      subscriptionId: subscription?.id as string,
      subscriptionExecutionId: subscription?.lastExecution?.id as string,
    }

    return retry({
      variables,
    })
      .then(() => {
        this.mounted && this.handleSetDisplayRetry(true)
      })
      .catch((error: ApolloError) => {
        logGraphqlError({
          error,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'Retry',
        })
        throw error
      })
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError({
      error,
      errorInfo,
      runtime: this.props.runtime,
      instance: INSTANCE,
    })
  }

  public render() {
    const { subscription, intl } = this.props
    const { displayRetry, displayAlert } = this.state

    if (!subscription) return null

    return (
      <ContentWrapper {...headerConfig({ intl })}>
        {() => (
          <div className="mr0 center w-100 pb5">
            {displayRetry && displayAlert && (
              <div className="mb5">
                <Alert
                  type="error"
                  action={{
                    label: intl.formatMessage(messages.errorMessageButton),
                    onClick: this.handleScrollToPayment,
                  }}
                  onClose={() => this.handleSetDisplayAlert(false)}
                >
                  {intl.formatMessage(messages.errorMessage)}
                </Alert>
              </div>
            )}
            <Summary subscription={subscription} />
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <DataCard subscription={subscription} />
              </div>
              <div className="pl4-ns pt6 w-50-ns">
                <Shipping subscription={subscription} />
              </div>
            </div>
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <Payment
                  subscription={subscription}
                  onMakeRetry={this.handleMakeRetry}
                  displayRetry={displayRetry}
                />
              </div>
              <div className="pt6 pl4-ns w-50-ns">
                <History subscriptionId={subscription.id} />
              </div>
            </div>
            <div className="pt6">
              <Products subscription={subscription} />
            </div>
          </div>
        )}
      </ContentWrapper>
    )
  }
}

interface Props
  extends WrappedComponentProps,
    ChildProps,
    InjectedRuntimeContext {
  retry: (args: { variables: RetryArgs }) => Promise<void>
}

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
  graphql(RETRY_MUTATION, { name: 'retry' }),
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
  ),
  branch<ChildProps>((props) => props.loading, renderComponent(Loader))
)

export { Subscription, Item }

export default enhance(SubscriptionsDetailsContainer)
