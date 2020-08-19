import React, { Component } from 'react'
import {
  injectIntl,
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
} from 'react-intl'
import { compose } from 'recompose'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { InjectedRuntimeContext, withRuntimeContext } from 'vtex.render-runtime'
import { ApolloError } from 'apollo-client'
import { graphql } from 'react-apollo'

import QUERY, {
  Result,
  Args as QueryArgs,
} from '../../graphql/queries/subscribePage.gql'
import ORDER_NOW, {
  Args as OrderNowArgs,
} from '../../graphql/mutations/orderNow.gql'
import { queryWrapper, logGraphqlError } from '../../tracking'
import Box from './CustomBox'
import Loading from './Loading'
import Empty from './Empty'
import SubscriptionBox from './SubscriptionBox'

const messages = defineMessages({
  orderNowTitle: {
    id: 'store/subscribe-page.order-now-title',
    defaultMessage: 'Comprar e assinar',
  },
  orderNowDescription: {
    id: 'store/subscribe-page.order-now-description',
    defaultMessage:
      'Você recebe seu produto agora, e cadastra uma assinatura para recebê-lo automaticamente na frequência que desejar.',
  },
  createTitle: {
    id: 'store/subscribe-page.create-title',
    defaultMessage: 'Criar assinatura',
  },
  createDescription: {
    id: 'store/subscribe-page.create-description',
    defaultMessage:
      'Cadastre uma assinatura e receba automaticamente na frequência que desejar.',
  },
  addToExistingTitle: {
    id: 'store/subscribe-page.add-to-existing-title',
    defaultMessage: 'Adicionar em uma assinatura já existente',
  },
  addToExistingDescription: {
    id: 'store/subscribe-page.add-to-existing-description',
    defaultMessage:
      'Selecione a assinatura que deseja acrescentar esse produto:',
  },
})

const INSTANCE = 'SubscribePage'

class SubscribePageContainer extends Component<Props> {
  public state = {
    isLoading: false,
  }

  private handleOrderNow = () => {
    const { orderFormId, orderNow, runtime, item } = this.props

    const items = [
      {
        quantity: 1,
        id: parseInt(item?.skuId as string, 10),
        seller: '1',
      },
    ]

    const variables = {
      orderFormId,
      items,
    }

    this.setState({ isLoading: true })

    orderNow({ variables })
      .then(() => {
        window.location.href = '/checkout/'
      })
      .catch((error: ApolloError) => {
        logGraphqlError({
          error,
          variables,
          runtime,
          type: 'MutationError',
          instance: `${INSTANCE}/OrderNow`,
        })
      })
      .finally(() => this.setState({ isLoading: false }))
  }

  private handleCreate = () => null

  private handleAdd = (subscriptionId: string) => {
    console.warn(subscriptionId)
  }

  public render() {
    const { loading, item, subscriptions } = this.props

    const SubscriptionList =
      item && subscriptions && subscriptions.length > 0 ? (
        <>
          <h4 className="t-heading-4 ml0-l ml4 mb4 mt8">
            <FormattedMessage {...messages.addToExistingTitle} />
          </h4>
          <p className="t-body c-muted-1 ml0-l ml4 mb5">
            <FormattedMessage {...messages.addToExistingDescription} />
          </p>
          {subscriptions.map((subscription) => (
            <div className="mb4" key={subscription.id}>
              <SubscriptionBox
                subscription={subscription}
                item={item}
                isLoading={this.state.isLoading}
                onAdd={this.handleAdd}
              />
            </div>
          ))}
        </>
      ) : null

    const Body = (
      <>
        <div className="mb4">
          <Box
            title={messages.orderNowTitle}
            description={messages.orderNowDescription}
            onClick={this.handleOrderNow}
          />
        </div>
        <Box
          title={messages.createTitle}
          description={messages.createDescription}
          onClick={this.handleCreate}
        />
        {SubscriptionList}
      </>
    )

    let State
    if (loading) {
      State = <Loading />
    } else if (!item) {
      State = <Empty />
    } else {
      State = Body
    }

    return (
      <section className="flex flex-column items-center pv8 bg-muted-5 min-vh-100">
        <div className="w-100 mw7">{State}</div>
      </section>
    )
  }
}

type InputProps = RouteComponentProps<{ skuId: string }>

type InnerProps = {
  orderNow: (args: { variables: OrderNowArgs }) => Promise<void>
} & InjectedIntlProps &
  InjectedRuntimeContext

interface ChildProps {
  loading: boolean
  subscriptions?: Result['subscriptions']
  item?: Result['item']
  orderFormId?: string
}

type Props = InnerProps & ChildProps

const enhance = compose<Props, {}>(
  injectIntl,
  withRouter,
  withRuntimeContext,
  graphql(ORDER_NOW, { name: 'orderNow' }),
  queryWrapper<InputProps, Result, QueryArgs, ChildProps>(INSTANCE, QUERY, {
    options: (input) => ({
      variables: {
        skuId: input.match.params.skuId,
      },
    }),
    props: ({ data }) => ({
      loading: data?.loading ?? false,
      subscriptions: data?.subscriptions,
      item: data?.item,
      orderFormId: data?.orderForm?.orderFormId,
    }),
  })
)

export default enhance(SubscribePageContainer)
