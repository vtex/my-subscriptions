import React, { FunctionComponent } from 'react'
import { BaseLoading } from 'vtex.my-account-commons'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import ShippingSkeleton from './Shipping/ShippingSkeleton'
import HistorySkeleton from './History/HistorySkeleton'
import DataSkeleton from './DataCard/DataSkeleton'
import SummarySkeleton from './SummarySkeleton'
import PaymentSkeleton from './Payment/PaymentSkeleton'
import { headerConfig } from '.'
import { BASIC_CARD_WRAPPER, CSS } from '../../constants'

const SubscriptionDetailsLoader: FunctionComponent<Props> = ({
  data,
  intl,
}) => {
  return (
    <BaseLoading queryData={data} headerConfig={headerConfig({ intl })}>
      <div className="mr0 center w-100 pb5">
        <SummarySkeleton />
        <div className="flex flex-row-ns flex-column-s">
          <div className="pt6 pr4-ns w-50-ns">
            <DataSkeleton />
          </div>
          <div className="pl4-ns pt6 w-50-ns">
            <div
              className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}
            >
              <ShippingSkeleton />
            </div>
          </div>
        </div>
        <div className="flex flex-row-ns flex-column-s">
          <div className="pt6 pr4-ns w-50-ns">
            <div
              className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}
            >
              <PaymentSkeleton />
            </div>
          </div>
          <div className="pl4-ns pt6 w-50-ns">
            <HistorySkeleton />
          </div>
        </div>
      </div>
    </BaseLoading>
  )
}

interface Props extends InjectedIntlProps {
  data: unknown
}

export default injectIntl(SubscriptionDetailsLoader)