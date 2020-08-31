import React, { FunctionComponent } from 'react'

import { Subscription } from '../../../graphql/queries/detailsPage.gql'
import Frequency from '../../Frequency/Info'
import Payment from '../../DisplayPayment'

const DisplayData: FunctionComponent<Props> = ({ plan, payment }) => {
  return (
    <>
      <Frequency
        periodicity={plan.frequency.periodicity}
        purchaseDay={plan.purchaseDay}
        interval={plan.frequency.interval}
      />
      <div className="mt4">
        <Payment paymentMethod={payment.paymentMethod ?? null} />
      </div>
    </>
  )
}

type Props = {
  plan: Subscription['plan']
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']
}

export default DisplayData
