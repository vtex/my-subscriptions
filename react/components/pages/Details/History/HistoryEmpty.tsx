import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const HistoryEmpty = () => (
  <div className="tc">
    <div className="mt5 lh-copy f5 serious-black">
      <FormattedMessage id="store/subscription.order.no-order" />
    </div>
    <div className="lh-title f6 c-muted-1">
      <FormattedMessage id="store/subscription.order.awaiting-first-cycle" />
    </div>
  </div>
)

export default injectIntl(HistoryEmpty)
