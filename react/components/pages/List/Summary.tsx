import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../../constants'
import Frequency from '../../commons/FrequencyInfo'
import Name from '../../commons/SubscriptionName'
import Status from '../../commons/SubscriptionStatus'
import UpdateStatusButton from '../../commons/UpdateStatusButton'
import ItemDate from './ItemDate'

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
    <div className="w-100 flex flex-wrap pv6 pl3-ns pr5-ns">
      <div className="w-50-ns flex flex-row flex-wrap">
        <div className="w-100">
          <Name subscriptionGroup={item} />
        </div>
        <div className="w-100 mt6-s flex items-end">
          {isActive ? (
            <Frequency subscriptionsGroup={item} displayLabel={false} />
          ) : (
            <Status status={item.status} />
          )}
        </div>

        <div className="w-100 mt4-s flex items-center">
          <ItemDate item={item} />
        </div>
      </div>

      <div className="w-50-ns w-100-s flex-ns justify-end-ns mt6-s">
        <div className="w-100 mw5-ns self-center">
          <Button
            variation="secondary"
            onClick={() => onGoToDetails(item.orderGroup)}
            block
          >
            <FormattedMessage id="subscription.list.button.seeDetails" />
          </Button>

          {isPaused && (
            <div className="pt4">
              <UpdateStatusButton
                targetStatus={SubscriptionStatusEnum.Active}
                orderGroup={item.orderGroup}
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

export default SubscriptionsGroupItemSummary
