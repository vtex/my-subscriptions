import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Button, Tag } from 'vtex.styleguide'

import { SubscriptionStatusEnum, CSS } from '../../../../constants'
import FrequencyInfo from '../../../commons/FrequencyInfo'
import LabeledInfo from '../../../commons/LabeledInfo'
import ChargeDayInfo from './ChargeDayInfo'

const DisplayData: FunctionComponent<Props> = ({
  subscriptionsGroup,
  intl,
  onOpenEdit,
}) => {
  const displayEdit =
    subscriptionsGroup.status === SubscriptionStatusEnum.Active

  let displayDelivery = false
  if (subscriptionsGroup.shippingEstimate.estimatedDeliveryDate) {
    displayDelivery =
      subscriptionsGroup.shippingEstimate.estimatedDeliveryDate >
      subscriptionsGroup.nextPurchaseDate
  }

  return (
    <div className={CSS.cardWrapper}>
      <div className="flex">
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({
            id: 'subscription.data',
          })}
        </div>
        <div className="ml-auto">
          {displayEdit && (
            <Button size="small" variation="tertiary" onClick={onOpenEdit}>
              {intl.formatMessage({
                id: 'subscription.actions.edit',
              })}
            </Button>
          )}
        </div>
      </div>
      <div className="flex pt5-s pt5-ns w-100-s mr-auto">
        <div className="mr5 w-50-s w-100-ns">
          <FrequencyInfo
            periodicity={subscriptionsGroup.plan.frequency.periodicity}
            interval={subscriptionsGroup.plan.frequency.interval}
          />
          <div className="pt6">
            <LabeledInfo labelId="subscription.data.estimatedDelivery">
              {displayDelivery &&
                intl.formatDate(
                  subscriptionsGroup.shippingEstimate
                    .estimatedDeliveryDate as string,
                  {
                    timeZone: 'UTC',
                  }
                )}
            </LabeledInfo>
          </div>
        </div>
        <div className="w-50-s w-100-ns">
          <div className="pl6-s pl0-ns">
            <ChargeDayInfo subscriptionsGroup={subscriptionsGroup} />
          </div>
          <div className="pt6 pl6-s pl0-ns">
            <LabeledInfo labelId="subscription.nextPurchase">
              <div className="flex flex-row">
                <span className="db fw3 f5-ns f6-s c-on-base">
                  {intl.formatDate(subscriptionsGroup.nextPurchaseDate)}
                </span>
                {subscriptionsGroup.isSkipped && (
                  <div className="lh-solid mt1 ml3">
                    <Tag type="warning">
                      {intl.formatMessage({
                        id: 'subscription.skip.confirm',
                      })}
                    </Tag>
                  </div>
                )}
              </div>
            </LabeledInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  onOpenEdit: () => void
}

export default injectIntl(DisplayData)
