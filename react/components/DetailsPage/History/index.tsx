import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { CSS, BASIC_CARD_WRAPPER } from '../../../constants'
import HistoryList from './HistoryList'
import { Subscription } from '..'

const SubscriptionHistory: FunctionComponent<Props> = ({ subscription }) => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className="db-s di-ns db-ns b f4 tl c-on-base mb4">
      <FormattedMessage id="store/subscription.history" />
    </div>
    <div style={{ maxHeight: '260px', overflow: 'auto' }}>
      <HistoryList subscription={subscription} perPage={5} />
    </div>
  </div>
)

interface Props {
  subscription: Subscription
}

export default SubscriptionHistory
