import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import EditButton from '../../../commons/EditButton'
import FrequencyInfo from '../../../commons/FrequencyInfo'
import LabeledInfo from '../../../commons/LabeledInfo'
import { SubscriptionsGroup } from '..'

const DisplayData: FunctionComponent<Props> = ({ group, intl, onOpenEdit }) => {
  let displayDelivery = false
  if (group.shippingEstimate && group.shippingEstimate.estimatedDeliveryDate) {
    displayDelivery =
      group.shippingEstimate.estimatedDeliveryDate > group.nextPurchaseDate
  }

  return (
    <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
      <div className="flex">
        <div className="db-s di-ns f4 tl c-on-base">
          {intl.formatMessage({ id: 'subscription.data' })}
        </div>
        <div className="ml-auto">
          <EditButton
            onEdit={onOpenEdit}
            subscriptionStatus={group.status}
            testId="edit-frequency-button"
          />
        </div>
      </div>

      <div className="pt5-s pt5-ns w-100-s mr-auto">
        <FrequencyInfo
          periodicity={group.plan.frequency.periodicity}
          purchaseDay={group.purchaseSettings.purchaseDay}
          interval={group.plan.frequency.interval}
        />

        <div className="flex-l">
          <div className="w-50-l pt6">
            <LabeledInfo labelId="subscription.nextPurchase">
              <div className="flex flex-row">
                <span className="db fw3 f5-ns f6-s c-on-base">
                  {intl.formatDate(group.nextPurchaseDate)}
                </span>
                {group.isSkipped && (
                  <div className="lh-solid mt1 ml3">
                    <Tag type="warning">
                      {intl.formatMessage({ id: 'subscription.skip.confirm' })}
                    </Tag>
                  </div>
                )}
              </div>
            </LabeledInfo>
          </div>

          <div className="w-50-l pt6">
            <LabeledInfo labelId="subscription.data.estimatedDelivery">
              {displayDelivery &&
                intl.formatDate(
                  group.shippingEstimate &&
                    group.shippingEstimate.estimatedDeliveryDate,
                  { timeZone: 'UTC' }
                )}
            </LabeledInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  group: SubscriptionsGroup
  onOpenEdit: () => void
}

export default injectIntl(DisplayData)
