import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import type {
  SubscriptionExecutionStatus,
  SubscriptionStatus,
} from 'vtex.subscriptions-graphql'

import type { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Frequency from '../../Frequency/Info'
import Payment from '../../DisplayPayment'
import Address from '../../DisplayAddress'
import EditButton from '../../EditButton'

const DisplayData: FunctionComponent<Props> = ({
  plan,
  payment,
  address,
  lastExecutionStatus,
  onGoToEdition,
  status,
}) => (
  <Box
    title={
      <div className="flex flex-wrap justify-between items-center">
        <FormattedMessage id="details-page.preferences.title" />
        {(status === 'ACTIVE' || status === 'PAUSED') && (
          <EditButton onClick={onGoToEdition} withBackground />
        )}
      </div>
    }
  >
    <Frequency
      periodicity={plan.frequency.periodicity}
      purchaseDay={plan.purchaseDay}
      interval={plan.frequency.interval}
    />
    <div className="mt7">
      <Payment
        paymentMethod={payment.paymentMethod ?? null}
        lastExecutionStatus={lastExecutionStatus}
      />
    </div>
    <div className="mt7">
      <Address address={address ?? null} />
    </div>
  </Box>
)

type Props = {
  status: SubscriptionStatus
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
  onGoToEdition: () => void
}

export default DisplayData
