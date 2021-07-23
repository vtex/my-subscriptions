import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import Frequency from '../Frequency/Info'
import Name from '../SubscriptionName'
import Status from './SubscriptionStatus'
import UpdateStatusButton from '../UpdateStatusButton'
import ItemDate from './ItemDate'
import { Subscription } from '.'

const CSS_HANDLES = ['reactivateSubscriptionButton']

const SubscriptionSummary: FunctionComponent<Props> = ({
  subscription,
  onGoToDetails,
}) => {
  const isPaused = subscription.status === 'PAUSED'
  const isActive = subscription.status === 'ACTIVE'
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className="w-100 flex flex-wrap pv6 pl3-ns pr5-ns">
      <div className="w-50-ns flex flex-row flex-wrap">
        <div className="w-100">
          <Name
            skus={subscription.items.map((item) => item.sku)}
            subscriptionId={subscription.id}
            canEdit={subscription.status === 'ACTIVE'}
            name={subscription.name}
          />
        </div>
        <div className="w-100 mt6-s flex items-end">
          {isActive ? (
            <Frequency
              displayLabel={false}
              periodicity={subscription.plan.frequency.periodicity}
              interval={subscription.plan.frequency.interval}
              purchaseDay={subscription.plan.purchaseDay}
            />
          ) : (
            <Status status={subscription.status} />
          )}
        </div>
        <div className="w-100 mt4-s flex items-center">
          <ItemDate
            status={subscription.status}
            nextPurchaseDate={subscription.nextPurchaseDate}
            lastUpdate={subscription.lastUpdate}
          />
        </div>
      </div>
      <div className="w-50-ns w-100-s flex-ns justify-end-ns mt6-s">
        <div className="w-100 mw5-ns self-center">
          <Button
            variation="secondary"
            onClick={() => onGoToDetails(subscription.id)}
            block
          >
            <FormattedMessage id="subscription.list.button.seeDetails" />
          </Button>
          {isPaused && (
            <div className={`pt4 ${handles.reactivateSubscriptionButton}`}>
              <UpdateStatusButton
                targetStatus="ACTIVE"
                subscriptionId={subscription.id}
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
  subscription: Subscription
  onGoToDetails: (subscriptionId: string) => void
}

export default SubscriptionSummary
