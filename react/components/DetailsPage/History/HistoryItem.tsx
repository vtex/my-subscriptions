import React, { FunctionComponent } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'

import style from './style.css'
import { SubscriptionExecution } from './HistoryList'
import { displayOrderStatus } from './utils'

const HistoryItem: FunctionComponent<Props> = ({
  execution: { date, status },
  intl,
}) => {
  let statusColor = ''

  switch (status) {
    case 'SUCCESS':
    case 'SUCCESS_WITH_PARTIAL_ORDER':
      statusColor = 'c-success'
      break
    case 'SKIPED':
    case 'SUCCESS_WITH_NO_ORDER':
      statusColor = 'c-warning'
      break
    case 'FAILURE':
    case 'ORDER_ERROR':
    case 'PAYMENT_ERROR':
      statusColor = 'c-danger'
      break
    default:
      statusColor = 'c-muted-3'
      break
  }

  return (
    <li className={`${style.historyListItem} pb5 f5 c-on-base lh-copy`}>
      <div className={`${style.historyListItemDot} ${statusColor}`} />
      <div className={`${style.historyListItemContent}`}>
        <span className={style.historyListItemStatus}>
          {displayOrderStatus({ status, intl })}
        </span>
        <time className="db f6 c-muted-2 lh-title">
          {intl.formatDate(date, {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            timeZone: 'UTC',
          })}
        </time>
      </div>
    </li>
  )
}

interface Props extends WrappedComponentProps {
  execution: SubscriptionExecution
}

export default injectIntl(HistoryItem)
