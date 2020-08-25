import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import Name from '../../SubscriptionName'
import Menu from './Menu'
import Status from './Status'

const PageHeader: FunctionComponent<Props> = ({
  name,
  status,
  subscriptionId,
  skus,
  history,
  orderFormId,
  isSkipped,
}) => {
  const Title = (
    <span className="normal">
      <Name
        name={name}
        status={status}
        subscriptionId={subscriptionId}
        skus={skus}
        withIconBackground
      />
    </span>
  )

  return (
    <Header
      title={Title}
      linkLabel={
        <FormattedMessage
          id="store/details-page.header-back-button"
          defaultMessage="Todas as Assinaturas"
        />
      }
      onLinkClick={() => history.push('/subscriptions')}
    >
      <div className="flex">
        <Status status={status} />
        <div className="ml4">
          <Menu
            orderFormId={orderFormId}
            status={status}
            isSkipped={isSkipped}
            subscriptionId={subscriptionId}
            skus={skus}
          />
        </div>
      </div>
    </Header>
  )
}

type Props = {
  name?: string | null
  orderFormId?: string
  status: SubscriptionStatus
  isSkipped: boolean
  subscriptionId: string
  skus: Array<{
    id: string
    detailUrl: string
    name: string
    quantity: number
  }>
} & RouteComponentProps

export default withRouter(PageHeader)
