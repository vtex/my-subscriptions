import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import HistoryList from './HistoryList'
import { CSS } from '../../../../constants'

interface OuterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
}

const SubscriptionGroupHistory: FunctionComponent<OuterProps> = ({
  subscriptionsGroup,
}) => {
  return (
    <div className={CSS.cardWrapper}>
      <div className="mb5 f4 b tl c-on-base">
        <FormattedMessage id="store/subscription.history" />
      </div>
      <div style={{ maxHeight: '260px', overflow: 'auto' }}>
        <HistoryList subscriptionsGroup={subscriptionsGroup} perPage={5} />
      </div>
    </div>
  )
}
export default SubscriptionGroupHistory
