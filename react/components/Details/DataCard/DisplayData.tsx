import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { CSS, BASIC_CARD_WRAPPER } from '../../../constants'
import EditButton from '../EditButton'
import FrequencyInfo from '../../Frequency/Info'
import LabeledInfo from '../../LabeledInfo'
import { Subscription } from '..'

const messages = defineMessages({
  nextPurchase: {
    id: 'store/subscription.nextPurchase',
    defaultMessage: '',
  },
  skip: { id: 'store/subscription.skip.confirm', defaultMessage: '' },
  estimatedDelivery: {
    id: 'store/subscription.data.estimatedDelivery',
    defaultMessage: '',
  },
  cardTitle: {
    id: 'store/subscription.data',
    defaultMessage: '',
  },
})

const DisplayData: FunctionComponent<Props> = ({
  subscription,
  intl,
  onOpenEdit,
}) => {
  let displayDelivery = false
  if (subscription.estimatedDeliveryDate) {
    displayDelivery =
      subscription.estimatedDeliveryDate > subscription.nextPurchaseDate
  }

  return (
    <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
      <div className="flex">
        <div className="db-s di-ns f4 tl c-on-base">
          {intl.formatMessage(messages.cardTitle)}
        </div>
        <div className="ml-auto">
          <EditButton
            onEdit={onOpenEdit}
            subscriptionStatus={subscription.status}
            testId="edit-frequency-button"
          />
        </div>
      </div>
      <div className="pt5-s pt5-ns w-100-s mr-auto">
        <FrequencyInfo
          periodicity={subscription.plan.frequency.periodicity}
          purchaseDay={subscription.plan.purchaseDay}
          interval={subscription.plan.frequency.interval}
        />
        <div className="flex-l">
          <div className="w-50-l pt6">
            <LabeledInfo label={intl.formatMessage(messages.nextPurchase)}>
              <div className="flex">
                <span className="db fw3 f5-ns f6-s c-on-base">
                  {intl.formatDate(subscription.nextPurchaseDate)}
                </span>
                {subscription.isSkipped && (
                  <div className="lh-solid mt1 ml3">
                    <Tag type="warning">
                      {intl.formatMessage(messages.skip)}
                    </Tag>
                  </div>
                )}
              </div>
            </LabeledInfo>
          </div>
          {displayDelivery && (
            <div className="w-50-l pt6">
              <LabeledInfo
                label={intl.formatMessage(messages.estimatedDelivery)}
              >
                {intl.formatDate(subscription.estimatedDeliveryDate, {
                  timeZone: 'UTC',
                })}
              </LabeledInfo>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props extends WrappedComponentProps {
  subscription: Subscription
  onOpenEdit: () => void
}

export default injectIntl(DisplayData)
