import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { graphql } from 'react-apollo'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { ContentWrapper } from 'vtex.my-account-commons'
import {
  MutationRetrySubscriptionOrderArgs,
  SubscriptionsGroup as Group,
  Sku,
  SubscriptionOrder,
  PurchaseSettings,
} from 'vtex.subscriptions-graphql'

import SUBSCRIPTIONS_GROUP from '../../../graphql/subscriptionsGroup.gql'
import RETRY_MUTATION from '../../../graphql/retryMutation.gql'
import Alert from '../../commons/CustomAlert'
import {
  TagTypeEnum,
  SubscriptionStatus,
  SubscriptionOrderStatus,
  PAYMENT_DIV_ID,
  Periodicity,
} from '../../../constants'
import { scrollToElement } from '../../../utils'

import DataCard from './DataCard'
import Summary from './Summary'
import Payment from './Payment'
import Shipping from './Shipping'
import History from './History'
import Loader from './Loader'
import Products from './Products'

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

    return retry({
      variables: {
        subscriptionsGroupId: (group && group.id) as string,
        subscriptionOrderId: (group &&
          group.lastOrder &&
          group.lastOrder.id) as string,
      },
    }).then(() => {
      this.mounted && this.handleSetDisplayRetry(true)
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

export type SubscriptionsGroup = Pick<
  Group,
  | 'id'
  | 'name'
  | 'isSkipped'
  | 'totals'
  | 'shippingEstimate'
  | 'nextPurchaseDate'
  | 'shippingAddress'
> & {
  status: SubscriptionStatus
  subscriptions: Subscription[]
  lastOrder: Pick<SubscriptionOrder, 'id'> & {
    status: SubscriptionOrderStatus
  }
  purchaseSettings: Pick<
    PurchaseSettings,
    'currencySymbol' | 'purchaseDay' | 'paymentMethod'
  >
  plan: {
    frequency: {
      periodicity: Periodicity
      interval: number
    }
  }
  __typename: string
}

export interface Subscription {
  id: string
  sku: Pick<
    Sku,
    'imageUrl' | 'name' | 'detailUrl' | 'productName' | 'id' | 'measurementUnit'
  > & {
    variations?: { [key: string]: string } | null
  }
  quantity: number
  currentPrice: number
}

interface Props extends InjectedIntlProps, ChildProps {
  retry: (args: {
    variables: MutationRetrySubscriptionOrderArgs
  }) => Promise<void>
}

interface Response {
  group: SubscriptionsGroup
}
interface Variables {
  id: string
}

type InputProps = RouteComponentProps<{ subscriptionsGroupId: string }>

interface ChildProps {
  loading: boolean
  group?: SubscriptionsGroup
}

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  graphql(RETRY_MUTATION, { name: 'retry' }),
  graphql<InputProps, Response, Variables, ChildProps>(SUBSCRIPTIONS_GROUP, {
    options: input => ({
      variables: {
        id: input.match.params.subscriptionsGroupId,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      group: data && data.group,
      data,
    }),
  }),
  branch<ChildProps>(props => props.loading, renderComponent(Loader))
)

export default enhance(SubscriptionsGroupDetailsContainer)
