import React from 'react'
import { BaseLoading } from 'vtex.my-account-commons'
import { injectIntl, intlShape } from 'react-intl'

import ShippingSkeleton from './Shipping/ShippingSkeleton'
import PaymentSkeleton from './Payment/PaymentSkeleton'
import DataSkeleton from './DataCard/DataSkeleton'
import SummarySkeleton from './skeletons/SummarySkeleton'
import HistorySkeleton from './History/HistorySkeleton'
import { genericQueryShape } from '../../../proptypes'
import { parseErrorMessageId } from '../../../utils'
import { headerConfig } from '.'

const SubscriptionDetailsLoader = ({ data, intl }) => {
  return (
    <BaseLoading
      queryData={data}
      headerConfig={headerConfig({ intl })}
      parseError={parseErrorMessageId}>
      <div className="mr0 center w-100 pb5">
        <SummarySkeleton />
        <div className="flex flex-row-ns flex-column-s">
          <div className="pt6 pr4-ns w-50-ns">
            <DataSkeleton />
          </div>
          <div className="pl4-ns pt6 w-50-ns">
            <ShippingSkeleton />
          </div>
        </div>
        <div className="pt6">
          <PaymentSkeleton />
        </div>
        <div className="pt6 pb3">
          <HistorySkeleton />
        </div>
      </div>
    </BaseLoading>
  )
}

SubscriptionDetailsLoader.propTypes = {
  intl: intlShape.isRequired,
  data: genericQueryShape.isRequired,
}

export default injectIntl(SubscriptionDetailsLoader)
