import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { graphql } from 'react-apollo'
import { RouteComponentProps } from 'react-router-dom'
import { withRouter } from 'vtex.my-account-commons/Router'
import {
  MutationRetrySubscriptionOrderArgs,
  SubscriptionsGroup as Group,
  Sku,
  SubscriptionOrder,
  PurchaseSettings,
  Periodicity,
} from 'vtex.subscriptions-graphql'

import SUBSCRIPTIONS_GROUP from '../../../graphql/subscriptionsGroup.gql'
import RETRY_MUTATION from '../../../graphql/retryMutation.gql'
import Name from '../../commons/SubscriptionName'
import { UpdateAction } from '../../../constants'

import Modal from './UpdateSubscriptionSettingsModal'
import History from './History'
import Loader from './Loader'
import Products from './Products'
import Summary from './Summary'
import NotificationBar from './NotificationBar'
import Preferences from './Preferences'
import Menu from './Menu'

class SubscriptionsGroupDetailsContainer extends Component<
  Props,
  { updateAction: UpdateAction | null }
> {
  state = {
    updateAction: null,
  }

  private handleCloseModal = () => this.setState({ updateAction: null })

  private handleChangeUpdateAction = (updateAction: UpdateAction) =>
    this.setState({ updateAction })

  public render() {
    const { group } = this.props

    if (!group) return null

    return (
      <div className="w-100 flex flex-wrap c-on-base ph7">
        <Modal
          group={group}
          onCloseModal={this.handleCloseModal}
          updateAction={this.state.updateAction}
        />
        <div className="w-100 flex flex-wrap justify-between pb7">
          <Name
            skus={group.subscriptions.map(s => s.sku)}
            subscriptionsGroupId={group.id}
            status={group.status}
            isTitle
          />
          <div className="pt4 pt0-l w-100 w-auto-l">
            <Menu
              isSkipped={group.isSkipped}
              status={group.status}
              onChangeUpdateAction={this.handleChangeUpdateAction}
            />
          </div>
        </div>
        <div className="w-two-thirds-ns w-100 pr4-ns">
          <NotificationBar
            group={group}
            onChangeUpdateType={this.handleChangeUpdateAction}
          />
          <div className="pv6">
            <Preferences group={group} />
          </div>
          <Products group={group} />
        </div>
        <div className="w-third-ns w-100 pl4-ns">
          <Summary group={group} />
          <div className="pt6">
            <History group={group} />
          </div>
        </div>
      </div>
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
  | 'status'
> & {
  subscriptions: Subscription[]
  lastOrder: Pick<SubscriptionOrder, 'id' | 'status'> | null
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
  priceAtSubscriptionDate: number
}

interface Props extends ChildProps {
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
    }),
  }),
  branch<ChildProps>(props => props.loading, renderComponent(Loader))
)

export default enhance(SubscriptionsGroupDetailsContainer)
