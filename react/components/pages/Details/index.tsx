import React, { Component } from 'react'
import { compose, branch, renderComponent, withProps } from 'recompose'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { graphql } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ContentWrapper } from 'vtex.my-account-commons'

import GROUPED_SUBSCRIPTION from '../../../graphql/groupedSubscription.gql'
import RETRY_MUTATION from '../../../graphql/retryMutation.gql'
import Alert from '../../commons/CustomAlert'
import {
  TagTypeEnum,
  SubscriptionOrderStatusEnum,
  PAYMENT_DIV_ID,
} from '../../../constants'
import DataCard from './DataCard'
import Summary from './Summary'
import Payment from './Payment'
import Shipping from './Shipping'
import History from './History'
import SubscriptionsGroupDetailsLoader from './Loader'

export function headerConfig({ intl }: InjectedIntlProps) {
  const backButton = {
    title: intl.formatMessage({ id: 'subscription.title.list' }),
    path: '/subscriptions',
  }

  return {
    backButton,
    title: intl.formatMessage({ id: 'subscription.title.single' }),
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
    const lastInstance = props.subscriptionsGroup.lastInstance

    return lastInstance &&
      lastInstance.status === SubscriptionOrderStatusEnum.PaymentError
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

  private handleScrollToPayment = () => {
    const paymentDiv = document.getElementById(PAYMENT_DIV_ID)
    paymentDiv && paymentDiv.scrollIntoView()
  }

  private handleMakeRetry = () => {
    const { retry, subscriptionsGroup } = this.props

    const lastInstance = subscriptionsGroup.lastInstance

    return retry({
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
        instanceId: lastInstance.dataInstanceId,
      },
    }).then(() => {
      this.mounted && this.handleSetDisplayRetry(true)
    })
  }

  public render() {
    const { subscriptionsGroup, intl } = this.props
    const { displayRetry, displayAlert } = this.state
    return (
      <ContentWrapper {...headerConfig({ intl })}>
        {() => (
          <div className="mr0 center w-100 pb5">
            <Alert
              visible={displayRetry && displayAlert}
              type={TagTypeEnum.Error}
              action={{
                labelId: 'subscription.alert.error.button.message',
                onClick: this.handleScrollToPayment,
              }}
              contentId="subscription.alert.error.message"
              onClose={() => this.handleSetDisplayAlert(false)}
            />
            <Summary subscriptionsGroup={subscriptionsGroup} />
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <DataCard subscriptionsGroup={subscriptionsGroup} />
              </div>
              <div className="pl4-ns pt6 w-50-ns">
                <Shipping subscriptionsGroup={subscriptionsGroup} />
              </div>
            </div>
            <div className="flex flex-row-ns flex-column-s">
              <div className="pt6 pr4-ns w-50-ns">
                <Payment
                  subscriptionsGroup={subscriptionsGroup}
                  onMakeRetry={this.handleMakeRetry}
                  displayRetry={displayRetry}
                />
              </div>
              <div className="pt6 pl4-ns w-50-ns">
                <History subscriptionsGroup={subscriptionsGroup} />
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>
    )
  }
}

const subscriptionQuery = {
  options: (props: Props) => ({
    variables: {
      orderGroup: props.match.params.orderGroup,
    },
  }),
}

interface Props
  extends InjectedIntlProps,
    RouteComponentProps<{ orderGroup: string }> {
  retry: (args: Variables<RetryArgs>) => Promise<void>
  subscriptionsGroup: SubscriptionsGroupItemType
  data: { groupedSubscription: SubscriptionsGroupItemType }
}

const enhance = compose<Props, any>(
  injectIntl,
  withRouter,
  graphql<Props, Variables<{ ordergroup: string }>>(
    GROUPED_SUBSCRIPTION,
    subscriptionQuery
  ),
  graphql(RETRY_MUTATION, { name: 'retry' }),
  withProps(({ data }: Props) => ({
    subscriptionsGroup: data.groupedSubscription,
  })),
  branch<Props>(
    ({ subscriptionsGroup }) => !subscriptionsGroup,
    renderComponent(SubscriptionsGroupDetailsLoader)
  )
)

export default enhance(SubscriptionsGroupDetailsContainer)
