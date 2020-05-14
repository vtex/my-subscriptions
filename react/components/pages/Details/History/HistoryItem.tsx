import React, { FunctionComponent } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'

import style from './style.css'
import { SubscriptionOrder } from './HistoryList'

const HistoryItem: FunctionComponent<OuterProps> = ({ order }) => {
  const { date, status } = order

  let statusColor
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
        <FormattedMessage id={`store/subscription.order.status.${status}`}>
          {text => <span className={style.historyListItemStatus}>{text}</span>}
        </FormattedMessage>
        <FormattedDate
          value={date}
          year="numeric"
          month="long"
          day="2-digit"
          timeZone="UTC"
        >
          {(text: string) => (
            <time className="db f6 c-muted-2 lh-title">{text}</time>
          )}
        </FormattedDate>
      </div>
    </li>
  )
}

interface OuterProps {
  order: SubscriptionOrder
}

export default HistoryItem
