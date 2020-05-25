import React, { FunctionComponent } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Tag } from 'vtex.styleguide'
import { SubscriptionStatus as StatusType } from 'vtex.subscriptions-graphql'

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
    id: 'store/subscription.status.paused',
    defaultMessage: '',
  },
  canceled: {
    id: 'store/subscription.status.canceled',
    defaultMessage: '',
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
