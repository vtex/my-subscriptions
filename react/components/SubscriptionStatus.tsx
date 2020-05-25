import React, { FunctionComponent } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { SubscriptionStatus as StatusEnum } from '../constants'

export function convertStatusInTagType(status: StatusEnum): string | null {
  switch (status) {
    case StatusEnum.Canceled:
      return 'error'
    case StatusEnum.Paused:
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
  status: StatusEnum
}

export default SubscriptionStatus
