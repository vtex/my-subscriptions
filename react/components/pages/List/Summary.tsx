import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import Frequency from '../../Frequency/Info'
import { SubscriptionStatus } from '../../../constants'
import Name from '../../commons/SubscriptionName'
import Status from '../../commons/SubscriptionStatus'
import UpdateStatusButton from '../../commons/UpdateStatusButton'
import ItemDate from './ItemDate'
import { SubscriptionsGroup } from '.'

const SubscriptionsGroupItemSummary: FunctionComponent<Props> = ({
  group,
  onGoToDetails,
}) => {
  const isPaused = group.status === SubscriptionStatus.Paused
  const isActive = group.status === SubscriptionStatus.Active

  return (
    <div className="w-100 flex flex-wrap pv6 pl3-ns pr5-ns">
      <div className="w-50-ns flex flex-row flex-wrap">
        <div className="w-100">
          <Name
            skus={group.subscriptions.map((subscriptions) => subscriptions.sku)}
            subscriptionsGroupId={group.id}
            status={group.status}
            name={group.name}
          />
        </div>
        <div className="w-100 mt6-s flex items-end">
          {isActive ? (
            <Frequency
              displayLabel={false}
              periodicity={group.plan.frequency.periodicity}
              interval={group.plan.frequency.interval}
              purchaseDay={group.purchaseSettings.purchaseDay}
            />
          ) : (
            <Status status={group.status} />
          )}
        </div>

        <div className="w-100 mt4-s flex items-center">
          <ItemDate
            status={group.status}
            nextPurchaseDate={group.nextPurchaseDate}
            lastStatusUpdate={group.lastStatusUpdate}
          />
        </div>
      </div>

      <div className="w-50-ns w-100-s flex-ns justify-end-ns mt6-s">
        <div className="w-100 mw5-ns self-center">
          <Button
            variation="secondary"
            onClick={() => onGoToDetails(group.id)}
            block
          >
            <FormattedMessage id="subscription.list.button.seeDetails" />
          </Button>

          {isPaused && (
            <div className="pt4">
              <UpdateStatusButton
                targetStatus={SubscriptionStatus.Active}
                subscriptionsGroupId={group.id}
                block
              >
                <FormattedMessage id="subscription.list.button.reactivate" />
              </UpdateStatusButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props {
  group: SubscriptionsGroup
  onGoToDetails: (subscriptionGroupId: string) => void
}

export default SubscriptionsGroupItemSummary
