import React, { FunctionComponent } from 'react'
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  InjectedIntlProps,
} from 'react-intl'
import { Box } from 'vtex.styleguide'
import { AddressRules, AddressSummary } from 'vtex.address-form'
import { PaymentFlag, utils } from 'vtex.payment-flags'

import { CSS } from '../../../constants'
import EditButton from '../../commons/EditButton'
import LabeledInfo from '../../commons/LabeledInfo'
import FrequencyInfo from '../../commons/FrequencyInfo'

import { SubscriptionsGroup } from '.'

const messages = defineMessages({
  address: {
    id: 'subscription.shipping.address',
    defaultMessage: '',
  },
  payment: {
    id: 'subscription.payment',
    defaultMessage: '',
  },
  billing: {
    id: 'a',
    defaultMessage: 'Billing day',
  },
})

const Preferences: FunctionComponent<Props> = ({ group, intl }) => {
  return (
    <Box>
      <div className={`${CSS.cardTitle} flex justify-between`}>
        <FormattedMessage
          id="store/subscriptions.card.preferences.title"
          defaultMessage="Preferences"
        />
        <EditButton
          onEdit={() => null}
          subscriptionStatus={group.status}
          testId="edit-products-button"
        />
      </div>
      <div className="flex flex-wrap">
        <div className="w-50-ns w-100 mb6">
          <FrequencyInfo
            periodicity={group.plan.frequency.periodicity}
            purchaseDay={group.purchaseSettings.purchaseDay}
            interval={group.plan.frequency.interval}
          />
        </div>
        <div className="w-50-ns w-100 mb6">
          <LabeledInfo labelId={messages.payment}>
            {group.purchaseSettings.paymentMethod ? (
              <div className="flex">
                <div className="h2">
                  <PaymentFlag
                    paymentSystemId={
                      group.purchaseSettings.paymentMethod.paymentSystemId
                    }
                  />
                </div>
                <span className="ml4 flex items-center">
                  {utils.displayPayment({
                    intl,
                    paymentSystemGroup:
                      group.purchaseSettings.paymentMethod.paymentSystemGroup,
                    paymentSystemName:
                      group.purchaseSettings.paymentMethod.paymentSystemName,
                    lastDigits: group.purchaseSettings.paymentMethod.paymentAccount?.cardNumber.slice(
                      -4
                    ),
                  })}
                </span>
              </div>
            ) : null}
          </LabeledInfo>
        </div>
        <div className="w-50-ns w-100 mb6">
          <LabeledInfo labelId={messages.billing}>
            {group.purchaseSettings.purchaseDay}
          </LabeledInfo>
        </div>
        <div className="w-50-ns w-100 mb6">
          <LabeledInfo labelId={messages.address}>
            {group.shippingAddress ? (
              <AddressRules
                country={group.shippingAddress.country}
                shouldUseIOFetching
              >
                <AddressSummary address={group.shippingAddress} />
              </AddressRules>
            ) : null}
          </LabeledInfo>
        </div>
      </div>
    </Box>
  )
}

type Props = {
  group: SubscriptionsGroup
} & InjectedIntlProps

export default injectIntl(Preferences)
