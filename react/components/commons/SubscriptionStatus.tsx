import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { TagTypeEnum, SubscriptionStatus as StatusEnum } from '../../constants'

export function convertStatusInTagType(status: StatusEnum): TagTypeEnum | null {
  switch (status) {
    case StatusEnum.Canceled:
      return TagTypeEnum.Error
    case StatusEnum.Paused:
      return TagTypeEnum.Warning
    default:
      return null
  }
}

interface Props {
  status: StatusEnum
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
