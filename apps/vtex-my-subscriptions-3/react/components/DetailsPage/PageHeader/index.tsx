import React, { FunctionComponent } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { PageHeader as Header, ButtonWithIcon, Tag } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { useCssHandles } from 'vtex.css-handles'

import Name from '../../SubscriptionName'
import Menu from './Menu'
import Status from './Status'
import Icon from './IconHistory'
import { SubscriptionAction } from '../utils'
import { useFreeTrial } from '../FreeTrialContext'

const CSS_HANDLES = [
  'headerNextPurchaseDate',
  'headerFreeTrialBadge',
] as const

function getRemainingDays(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate)

  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffMs = target.getTime() - now.getTime()

  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

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
  nextPurchaseDate,
}) => {
  const { isActivelyInTrial } = useFreeTrial()
  const handles = useCssHandles(CSS_HANDLES)

  const Title = (
    <span className="normal">
      <Name
        name={name}
        canEdit={status === 'ACTIVE'}
        subscriptionId={subscriptionId}
        skus={skus}
        withIconBackground
      />
      <div className={`${handles.headerNextPurchaseDate} mt3 f6 c-muted-1 fw4`}>
        <FormattedMessage
          id="details-page.page-header.next-purchase"
          values={{
            date: (
              <FormattedDate
                value={nextPurchaseDate}
                day="numeric"
                month="long"
                year="numeric"
              />
            ),
          }}
        />
      </div>
      {isActivelyInTrial && (
        <div className={`${handles.headerFreeTrialBadge} mt3`} role="status">
          <Tag type="success">
            <FormattedMessage
              id="details-page.free-trial.badge"
              values={{
                days: getRemainingDays(nextPurchaseDate),
              }}
            />
          </Tag>
        </div>
      )}
    </span>
  )

  return (
    <Header
      title={Title}
      linkLabel={<FormattedMessage id="details-page.page-header.back-button" />}
      onLinkClick={() => history.push('/subscriptions')}
    >
      <div className="flex">
        <div className="mr4">
          <ButtonWithIcon
            icon={<Icon />}
            variation="tertiary"
            onClick={() => onOpenHistory()}
          >
            <FormattedMessage id="details-page.page-header.history" />
          </ButtonWithIcon>
        </div>
        <Status status={status} />
        <div className="ml4">
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
  nextPurchaseDate: string
  onOpenHistory: () => void
  onUpdateAction: (action: SubscriptionAction) => void
  skus: Array<{
    detailUrl: string
    name: string
  }>
} & RouteComponentProps

export default withRouter(PageHeader)
