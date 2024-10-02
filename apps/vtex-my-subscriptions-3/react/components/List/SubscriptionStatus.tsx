import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Tag } from 'vtex.styleguide'
import type { SubscriptionStatus as StatusType } from 'vtex.subscriptions-graphql'

export function convertStatusInTagType(status: StatusType): string | null {
  switch (status) {
    case 'CANCELED':
      return 'error'

    case 'PAUSED':
      return 'warning'

    default:
      return null
  }
}

defineMessages({
  paused: {
    id: 'subscription.status.paused',
  },
  canceled: {
    id: 'subscription.status.canceled',
  },
})

const SubscriptionStatus: FunctionComponent<Props> = ({ status }) => {
  const type = convertStatusInTagType(status)

  if (!type) {
    return null
  }

  return (
    <Tag type={type}>
      <FormattedMessage id={`subscription.status.${status.toLowerCase()}`} />
    </Tag>
  )
}

interface Props {
  status: StatusType
}

export default SubscriptionStatus
