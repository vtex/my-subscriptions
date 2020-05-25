import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { SubscriptionOrderStatus } from '../../../../constants'
import style from './style.css'
import { SubscriptionOrder } from './HistoryList'
import { displayOrderStatus } from './utils'

const HistoryItem: FunctionComponent<Props> = ({ order, intl }) => {
  const { date, status } = order

  let statusColor = ''

  switch (status) {
    case SubscriptionOrderStatus.Success:
    case SubscriptionOrderStatus.SuccessWithPartialOrder:
      statusColor = 'c-success'
      break
    case SubscriptionOrderStatus.Skiped:
    case SubscriptionOrderStatus.SuccessWithNoOrder:
      statusColor = 'c-warning'
      break
    case SubscriptionOrderStatus.Failure:
    case SubscriptionOrderStatus.OrderError:
    case SubscriptionOrderStatus.PaymentError:
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

interface Props extends InjectedIntlProps {
  order: SubscriptionOrder
}

export default injectIntl(HistoryItem)
