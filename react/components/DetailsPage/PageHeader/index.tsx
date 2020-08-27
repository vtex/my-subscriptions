import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header, ButtonWithIcon } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import Name from '../../SubscriptionName'
import Menu from './Menu'
import Status from './Status'
import Icon from './IconHistory'

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
        <FormattedMessage id="store/details-page.page-header.back-button" />
      }
      onLinkClick={() => history.push('/subscriptions')}
    >
      <div className="flex">
        <div className="mr4">
          <ButtonWithIcon
            icon={<Icon />}
            variation="tertiary"
            onClick={() =>
              history.push(`/subscriptions/${subscriptionId}/history`)
            }
          >
            <FormattedMessage id="store/details-page.page-header.history" />
          </ButtonWithIcon>
        </div>
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
