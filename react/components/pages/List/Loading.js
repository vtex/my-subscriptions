import React from 'react'
import PropTypes from 'prop-types'
import { BaseLoading } from 'vtex.my-account-commons'

import { parseErrorMessageId } from '../../../utils'
import { headerConfig } from '.'

import SubscriptionsSkeleton from './SubscriptionsGroupSkeleton'

const SubscriptionsGroupListLoading = ({ data }) => {
  return (
    <BaseLoading
      queryData={data}
      headerConfig={headerConfig}
      parseError={parseErrorMessageId}>
      <SubscriptionsSkeleton />
    </BaseLoading>
  )
}

SubscriptionsGroupListLoading.propTypes = {
  data: PropTypes.object.isRequired,
}

export default SubscriptionsGroupListLoading
