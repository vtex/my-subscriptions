import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Tag } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../enums'
import { convertStatusInTagType } from '../../utils'

interface Props {
  status: SubscriptionStatusEnum
}

const SubscriptionStatus: FunctionComponent<Props> = ({ status }) => {
  const type = convertStatusInTagType(status)
  return type ? (
    <Tag type={type}>
      <FormattedMessage id={`subscription.status.${status.toLowerCase()}`} />
    </Tag>
  ) : (
    <Fragment />
  )
}

export default SubscriptionStatus
