import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header, ButtonWithIcon } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { useCssHandles } from 'vtex.css-handles'

import Name from '../../SubscriptionName'
import Menu from './Menu'
import Status from './Status'
import Icon from './IconHistory'
import { SubscriptionAction } from '../utils'

const CSS_HANDLES = [
  'headerTitle',
  'headerOptions',
  'headerOptionsHistory',
  'headerOptionsStatus',
  'headerOptionsMenu',
]

const PageHeader: FunctionComponent<Props> = ({
  name,
  status,
  subscriptionId,
  skus,
  history,
  orderFormId,
  isSkipped,
  onUpdateAction,
  onOpenHistory,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const Title = (
    <span className={`normal ${handles.headerTitle}`}>
      <Name
        name={name}
        canEdit={status === 'ACTIVE'}
        subscriptionId={subscriptionId}
        skus={skus}
        withIconBackground
      />
    </span>
  )

  return (
    <Header
      title={Title}
      linkLabel={<FormattedMessage id="details-page.page-header.back-button" />}
      onLinkClick={() => history.push('/subscriptions')}
    >
      <div className={`flex ${handles.headerOptions}`}>
        <div className={`mr4 ${handles.headerOptionsHistory}`}>
          <ButtonWithIcon
            icon={<Icon />}
            variation="tertiary"
            onClick={() => onOpenHistory()}
          >
            <FormattedMessage id="details-page.page-header.history" />
          </ButtonWithIcon>
        </div>
        <div className={`mt4 ${handles.headerOptionsStatus}`}>
          <Status status={status} />
        </div>
        <div className={`ml4 ${handles.headerOptionsMenu}`}>
          <Menu
            orderFormId={orderFormId}
            status={status}
            isSkipped={isSkipped}
            onUpdateAction={onUpdateAction}
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
  onOpenHistory: () => void
  onUpdateAction: (action: SubscriptionAction) => void
  skus: Array<{
    detailUrl: string
    name: string
  }>
} & RouteComponentProps

export default withRouter(PageHeader)
