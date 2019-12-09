import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { CSS, BASIC_CARD_WRAPPER } from '../../../../constants'

import HistoryList from './HistoryList'

import { SubscriptionsGroup } from '..'

const SubscriptionGroupHistory: FunctionComponent<Props> = ({ group }) => (
  <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
    <div className={CSS.cardTitle}>
      <FormattedMessage id="store/subscription.history" />
    </div>
    <div style={{ maxHeight: '260px', overflow: 'auto' }}>
      <HistoryList group={group} perPage={5} />
    </div>
  </div>
)

interface Props {
  group: SubscriptionsGroup
}

export default SubscriptionGroupHistory
