import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Tag } from 'vtex.styleguide'
import { SubscriptionStatus as StatusOptions } from 'vtex.subscriptions-graphql'

import { TagTypeEnum } from '../../constants'

export function convertStatusInTagType(
  status: StatusOptions
): TagTypeEnum | null {
  switch (status) {
    case 'CANCELED':
      return TagTypeEnum.Error
    case 'PAUSED':
      return TagTypeEnum.Warning
    default:
      return null
  }
}

interface Props {
  status: StatusOptions
}

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

export default SubscriptionStatus
