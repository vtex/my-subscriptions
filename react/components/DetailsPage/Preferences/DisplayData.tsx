import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import { SubscriptionExecutionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Frequency from '../../Frequency/Info'
import Payment from '../../DisplayPayment'
import Address from '../../DisplayAddress'

const DisplayData: FunctionComponent<Props> = ({
  plan,
  payment,
  address,
  lastExecutionStatus,
}) => {
  return (
    <Box title={<FormattedMessage id="store/details-page.preferences.title" />}>
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
}

type Props = {
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
  lastExecutionStatus?: SubscriptionExecutionStatus
}

export default DisplayData
