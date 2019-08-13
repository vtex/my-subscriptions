import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import HistoryList from './HistoryList'
import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'

const SubscriptionGroupHistory: FunctionComponent<OuterProps> = ({
  subscriptionsGroup,
}) => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className="db-s di-ns db-ns b f4 tl c-on-base mb4">
      <FormattedMessage id="store/subscription.history" />
    </div>
    <div style={{ maxHeight: '260px', overflow: 'auto' }}>
      <HistoryList subscriptionsGroup={subscriptionsGroup} perPage={5} />
    </div>
  </div>
)

interface OuterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
}

export default SubscriptionGroupHistory
