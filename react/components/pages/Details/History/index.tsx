import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'

import { CSS } from '../../../../constants'

import HistoryList from './HistoryList'

import { SubscriptionsGroup } from '..'

const SubscriptionGroupHistory: FunctionComponent<Props> = ({ group }) => (
  <Box>
    <div className={CSS.cardTitle}>
      <FormattedMessage id="store/subscription.history" />
    </div>
    <div style={{ maxHeight: '260px', overflow: 'auto' }}>
      <HistoryList group={group} perPage={5} />
    </div>
  </Box>
)

interface Props {
  group: SubscriptionsGroup
}

export default SubscriptionGroupHistory
