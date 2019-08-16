import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { TagTypeEnum, CSS, BASIC_CARD_WRAPPER } from '../../../constants'
import Alert from '../../commons/CustomAlert'
import Name from '../../commons/SubscriptionName'
import SubscriptionsStatus from '../../commons/SubscriptionStatus'
import SubscriptionTotals from './SubscriptionTotals'
import Menu from './Menu'

const SubscriptionSummary: FunctionComponent<Props> = ({
  subscriptionsGroup,
}) => {
  const { isSkipped, status } = subscriptionsGroup

  return (
    <Fragment>
      <Alert
        visible={isSkipped}
        type={TagTypeEnum.Warning}
        contentId="subscription.skip.alert"
      />
      <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
        <div className="db-s di-ns db-ns b f4 tl c-on-base mb4">
          <FormattedMessage id="subscription.summary" />
        </div>
        <div className="flex justify-between mb4">
          <Name subscriptionGroup={subscriptionsGroup} />
          <SubscriptionsStatus status={status} />
        </div>
        <div className="flex flex-wrap">
          <div className="w-50-l w-100 pr5-l pr0">
            <SubscriptionTotals
              totals={subscriptionsGroup.totals}
              currencyCode={subscriptionsGroup.purchaseSettings.currencySymbol}
            />
          </div>
          <div className="w-50-l w-100 mt0-l mt4 pl5-l ph0">
            <Menu subscriptionsGroup={subscriptionsGroup} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
}

export default SubscriptionSummary
