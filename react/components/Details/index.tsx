import React, { Component, ErrorInfo } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import { graphql } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { ContentWrapper } from 'vtex.my-account-commons'
import { MutationRetrySubscriptionOrderArgs } from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'
import { Alert } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import SUBSCRIPTIONS_GROUP, {
  SubscriptionsGroup,
  Subscription,
  Result,
  Args,
} from '../../graphql/subscriptionsGroup.gql'
import RETRY_MUTATION from '../../graphql/retryMutation.gql'
import { SubscriptionOrderStatus, PAYMENT_DIV_ID } from '../../constants'
import { scrollToElement } from '../../utils'
import DataCard from './DataCard'
import Summary from './Summary'
import Payment from './Payment'
import Shipping from './Shipping'
import History from './History'
import Loader from './Loader'
import Products from './Products'
import { logError, logGraphqlError, queryWrapper } from '../../tracking'

const INSTANCE = 'SubscriptionsDetails'

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

export function headerConfig({ intl }: InjectedIntlProps) {
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

class SubscriptionsGroupDetailsContainer extends Component<Props> {
  public state = {
    displayRetry: false,
    displayAlert: true,
  }

  private mounted = false

  public static getDerivedStateFromProps(props: Props) {
    const lastOrder = props.group && props.group.lastOrder

    return lastOrder &&
      lastOrder.status === SubscriptionOrderStatus.PaymentError
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
    const { retry, group } = this.props

    const variables = {
      subscriptionsGroupId: group?.id as string,
      subscriptionOrderId: group?.lastOrder?.id as string,
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
    const { group, intl } = this.props
    const { displayRetry, displayAlert } = this.state

    if (!group) return null

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
            <Summary group={group} />
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <DataCard group={group} />
              </div>
              <div className="pl4-ns pt6 w-50-ns">
                <Shipping group={group} />
              </div>
            </div>
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <Payment
                  group={group}
                  onMakeRetry={this.handleMakeRetry}
                  displayRetry={displayRetry}
                />
              </div>
              <div className="pt6 pl4-ns w-50-ns">
                <History group={group} />
              </div>
            </div>

            <div className="pt6">
              <Products group={group} />
            </div>
          </div>
        )}
      </ContentWrapper>
    )
  }
}

interface Props extends InjectedIntlProps, ChildProps, InjectedRuntimeContext {
  retry: (args: {
    variables: MutationRetrySubscriptionOrderArgs
  }) => Promise<void>
}

type InputProps = RouteComponentProps<{ subscriptionsGroupId: string }> &
  InjectedRuntimeContext

interface ChildProps {
  loading: boolean
  group?: SubscriptionsGroup
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  withRuntimeContext,
  graphql(RETRY_MUTATION, { name: 'retry' }),
  queryWrapper<InputProps, Result, Args, ChildProps>(
    INSTANCE,
    SUBSCRIPTIONS_GROUP,
    {
      options: (input) => ({
        variables: {
          id: input.match.params.subscriptionsGroupId,
        },
      }),
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        group: data?.group,
        data,
      }),
    }
  ),
  branch<ChildProps>((props) => props.loading, renderComponent(Loader))
)

export { SubscriptionsGroup, Subscription }

export default enhance(SubscriptionsGroupDetailsContainer)
