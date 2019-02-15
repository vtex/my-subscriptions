import React, { Fragment, FunctionComponent } from 'react'
import { Tag } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../enums'
import { convertStatusInTagType } from '../../utils'

interface Props {
  status: SubscriptionStatusEnum
}

const SubscriptionStatus: FunctionComponent<Props> = ({ status }) => {
  const type = convertStatusInTagType(status)
  return type ? <Tag type={type} /> : <Fragment />
}

export default SubscriptionStatus
