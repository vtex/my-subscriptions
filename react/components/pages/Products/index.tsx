import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { graphql } from 'react-apollo'
import { compose, withProps } from 'recompose'
import { withRouter, Link, RouteComponentProps } from 'react-router-dom'
import { EmptyState, Button } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'
import { ApolloError } from 'apollo-client'

import Product from './Product'
import ViewItemsSkeleton from '../../commons/ViewItemsSkeleton'
import SUBSCRIPTIONS_INFO from '../../../graphql/subscriptionsInfo.gql'

const headerConfig = ({
  intl,
  orderGroup,
}: {
  intl: ReactIntl.InjectedIntl
  orderGroup: string
}) => {
  const backButton = {
    title: intl.formatMessage({ id: 'subscription.title.single' }),
    path: `/subscriptions/${orderGroup}`,
  }
  return {
    backButton,
    title: intl.formatMessage({ id: 'subscription.title.single' }),
    namespace: 'vtex-account__subscription-products',
  }
}

const SubscriptionProducts: FunctionComponent<InnerProps> = ({
  data: { subscriptionsInfo, error, loading },
  intl,
  orderGroup,
}) => {
  const renderWrapper = (children: any) => {
    return (
      <ContentWrapper
        {...headerConfig({
          intl,
          orderGroup,
        })}
      >
        {() => children}
      </ContentWrapper>
    )
  }

  if (loading || !(subscriptionsInfo && subscriptionsInfo.subscriptions)) {
    return renderWrapper(<ViewItemsSkeleton />)
  }

  const {
    subscriptions,
    purchaseSettings: { currencySymbol },
  } = subscriptionsInfo

  if (subscriptions == null || error) {
    return renderWrapper(
      <EmptyState
        title={intl.formatMessage({
          id: 'subscription.items.notFound',
        })}
      >
        <p>
          {intl.formatMessage({
            id: 'subscription.items.notFoundHelperText',
          })}
        </p>
        <div className="pt5">
          <Button variation="secondary" size="small">
            <Link to={'/subscriptions'}>
              <span className="flex align-baseline no-underline">
                {intl.formatMessage({
                  id: 'subscription.items.notFoundAction',
                })}
              </span>
            </Link>
          </Button>
        </div>
      </EmptyState>
    )
  }

  return renderWrapper(
    <div className="w-100 center pb6">
      {subscriptions.map((subscription: SubscriptionType) => {
        return (
          <Product
            key={subscription.SubscriptionId}
            subscription={subscription}
            orderGroup={orderGroup}
            currency={currencySymbol}
          />
        )
      })}
    </div>
  )
}

const subscriptionsQuery = {
  options: ({ orderGroup }: InnerProps) => ({
    variables: {
      orderGroup,
    },
  }),
}

interface InnerProps
  extends InjectedIntlProps,
    RouteComponentProps<{ orderGroup: string }> {
  orderGroup: string
  data: {
    loading: boolean
    error: ApolloError
    subscriptionsInfo?: {
      subscriptions: SubscriptionType[]
      purchaseSettings: PurchaseSettings
    }
  }
}

const enhance = compose<InnerProps, void>(
  injectIntl,
  withRouter,
  withProps(({ match }: InnerProps) => ({
    orderGroup: match.params.orderGroup,
  })),
  graphql(SUBSCRIPTIONS_INFO, subscriptionsQuery)
)

export default enhance(SubscriptionProducts)
