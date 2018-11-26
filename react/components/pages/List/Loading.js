import React from 'react'
import PropTypes from 'prop-types'
import { BaseLoading } from 'vtex.my-account-commons'

import { headerConfig, parseError } from '.'

import SubscriptionsSkeleton from './SubscriptionsSkeleton'

const SubscriptionsListLoading = ({ data }) => {
  return (
    <BaseLoading
      queryData={data}
      headerConfig={headerConfig}
      parseError={parseError}>
      <SubscriptionsSkeleton />
    </BaseLoading>
  )
}

SubscriptionsListLoading.propTypes = {
  data: PropTypes.object.isRequired,
}

export default SubscriptionsListLoading
