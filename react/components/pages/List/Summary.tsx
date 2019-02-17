import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../../enums'
import Frequency from '../../commons/FrequencyInfo'
import Status from '../../commons/SubscriptionStatus'
import ItemDate from './ItemDate'
import Name from './SubscriptionName'

interface Props {
  item: SubscriptionsGroupItemType
  onGoToDetails: (orderGroup: string) => void
}

const SubscriptionsGroupItemSummary: FunctionComponent<Props> = ({
  item,
  onGoToDetails,
}) => {
  const isPaused = item.status === SubscriptionStatusEnum.Paused
  const isActive = item.status === SubscriptionStatusEnum.Active

  return (
    <div className="w-100 flex pv6 ph3">
      <div className="w-50 flex flex-row flex-wrap">
        <div className="w-100">
          <Name subscriptionGroup={item} />
        </div>
        <div className="w-100 flex items-end">
          {isActive ? (
            <Frequency
              periodicity={item.plan.frequency.periodicity}
              interval={item.plan.frequency.interval}
            />
          ) : (
            <Status status={item.status} />
          )}
        </div>
        <div className="w-100 flex items-center">
          <ItemDate item={item} />
        </div>
      </div>
      <div className="w-50 flex flex-row flex-wrap">
        <div className="w-100 mw5 self-center center">
          <Button
            variation="secondary"
            onClick={() => onGoToDetails(item.orderGroup)}
            block>
            <FormattedMessage id="subscription.list.button.seeDetails" />
          </Button>
          {isPaused && (
            <div className="pt4">
              <Button variation="secondary" block>
                <FormattedMessage id="subscription.list.button.reactivate" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsGroupItemSummary
