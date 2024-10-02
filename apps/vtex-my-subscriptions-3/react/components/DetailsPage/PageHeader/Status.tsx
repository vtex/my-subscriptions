import type { FunctionComponent } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import type { SubscriptionStatus as Status } from 'vtex.subscriptions-graphql'

import styles from './styles.css'

const messages = defineMessages({
  active: {
    id: 'details-page.page-header.status.active',
  },
  paused: {
    id: 'details-page.page-header.status.paused',
  },
  canceled: {
    id: 'details-page.page-header.status.canceled',
  },
})

const SubscriptionStatus: FunctionComponent<Props> = ({ status, intl }) => {
  let color
  let content

  switch (status) {
    case 'ACTIVE':
      color = 'c-success'
      content = intl.formatMessage(messages.active)
      break

    case 'PAUSED':
      color = 'c-warning'
      content = intl.formatMessage(messages.paused)
      break

    default:
      color = 'c-danger'
      content = intl.formatMessage(messages.canceled)
  }

  return (
    <div className="flex items-center ttu fw6">
      <div className={`${color} ${styles.statusDotBorder} mr5 pa1`}>
        <div className={`${styles.statusDot}`} />
      </div>
      {content}
    </div>
  )
}

type Props = {
  status: Status
} & WrappedComponentProps

export default injectIntl(SubscriptionStatus)
