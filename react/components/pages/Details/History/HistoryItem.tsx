import React, { FunctionComponent } from 'react'
import { compose } from 'recompose'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'

import style from './style.css'

interface OuterProps {
  order: SubscriptionOrder
}

interface InnerProps extends InjectedIntlProps {}

const HistoryItem: FunctionComponent<OuterProps & InnerProps> = ({
  intl,
  order,
}) => {
  const { date, status } = order
  const formattedDate = intl.formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    timeZone: 'UTC',
  })

  let statusColor = `c-muted-3`
  if (status === 'SUCCESS' || status === 'SUCCESS_WITH_PARTIAL_ORDER')
    statusColor = `c-success`
  else if (status === 'SKIPED' || status === 'SUCCESS_WITH_NO_ORDER')
    statusColor = `c-warning`
  else if (
    status === 'FAILURE' ||
    status === 'ORDER_ERROR' ||
    status === 'PAYMENT_ERROR'
  )
    statusColor = `c-danger`

  return (
    <li className={`${style.historyListItem} pb5 f5 c-on-base lh-copy`}>
      <div className={`${style.historyListItemDot} ${statusColor}`}></div>
      <div className={`${style.historyListItemContent}`}>
        <FormattedMessage id={`store/subscription.order.status.${status}`}>
          {text => <span className={style.historyListItemStatus}>{text}</span>}
        </FormattedMessage>
        <time className="db f6 c-muted-2 lh-title">
          {formattedDate}
        </time>
      </div>
    </li>
  )
}

const enhance = compose<OuterProps & InnerProps, OuterProps>(injectIntl)

export default enhance(HistoryItem)
