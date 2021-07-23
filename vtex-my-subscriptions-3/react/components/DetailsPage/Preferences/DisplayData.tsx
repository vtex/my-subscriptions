import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import {
  SubscriptionExecutionStatus,
  SubscriptionStatus,
} from 'vtex.subscriptions-graphql'
import { useCssHandles } from 'vtex.css-handles'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Frequency from '../../Frequency/Info'
import Payment from '../../DisplayPayment'
import Address from '../../DisplayAddress'
import EditButton from '../../EditButton'

const CSS_HANDLES = [
  'subscriptionPreferences',
  'subscriptionPreferencesTitle',
  'subscriptionFrequency',
  'subscriptionPayment',
  'subscriptionShippingAddress',
]

const DisplayData: FunctionComponent<Props> = ({
  plan,
  payment,
  address,
  lastExecutionStatus,
  onGoToEdition,
  status,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.subscriptionPreferences}>
      <Box
        title={
          <div
            className={`flex flex-wrap justify-between items-center ${handles.subscriptionPreferencesTitle}`}
          >
            <FormattedMessage id="details-page.preferences.title" />
            {(status === 'ACTIVE' || status === 'PAUSED') && (
              <EditButton onClick={onGoToEdition} withBackground />
            )}
          </div>
        }
      >
        <div className={handles.subscriptionFrequency}>
          <Frequency
            periodicity={plan.frequency.periodicity}
            purchaseDay={plan.purchaseDay}
            interval={plan.frequency.interval}
          />
        </div>
        <div className={`mt7 ${handles.subscriptionPayment}`}>
          <Payment
            paymentMethod={payment.paymentMethod ?? null}
            lastExecutionStatus={lastExecutionStatus}
          />
        </div>
        <div className={`mt7 ${handles.subscriptionShippingAddress}`}>
          <Address address={address ?? null} />
        </div>
      </Box>
    </div>
  )
}

type Props = {
  status: SubscriptionStatus
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
  onGoToEdition: () => void
}

export default DisplayData
