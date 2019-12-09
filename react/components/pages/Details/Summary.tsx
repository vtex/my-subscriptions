import React, { FunctionComponent } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'

import { BASIC_CARD_WRAPPER, CSS } from '../../../constants'
import FormattedPrice from '../../commons/FormattedPrice'
import { SubscriptionsGroup } from '.'

const SubscriptionTotalsSummary: FunctionComponent<Props> = ({
  group,
  intl,
}) => {
  const totals = group.totals
  const currencyCode = group.purchaseSettings.currencySymbol
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  const length = totals ? totals.length : 0

  return (
    <div className={BASIC_CARD_WRAPPER}>
      <div className={CSS.cardTitle}>
        <FormattedMessage id="subscription.summary" />
      </div>
      {totals &&
        totals.map((total, i) => (
          <div
            className={`flex justify-between pb${i === length - 1 ? 5 : 3}`}
            key={`totals-${total.id}`}
          >
            <span>
              {intl.formatMessage({
                id: `subscription.summary.${total.id.toLowerCase()}`,
              })}
            </span>
            <FormattedPrice value={total.value} currency={currencyCode} />
          </div>
        ))}

      <div className="flex justify-between pt7 bt bw1 b--muted-5 b">
        <FormattedMessage id="order.summary.total" />
        <FormattedPrice value={fullPrice} currency={currencyCode} />
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  group: SubscriptionsGroup
}

export default injectIntl(SubscriptionTotalsSummary)
