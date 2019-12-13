import React, { FunctionComponent } from 'react'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import { Box } from 'vtex.styleguide'

import FormattedPrice from '../../commons/FormattedPrice'
import { CSS } from '../../../constants'
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
    <Box noPadding>
      <div className={`${CSS.cardHorizontalPadding} pa7`}>
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

        <div className="bg-light-gray" style={{ height: '1px' }} />

        <div className="flex justify-between pt7 b">
          <FormattedMessage id="order.summary.total" />
          <FormattedPrice value={fullPrice} currency={currencyCode} />
        </div>
      </div>
      <div className="t-mini c-muted-1 bg-muted-5 ph7 pv5 bt b--muted-4">
        *Price valid for today.
      </div>
    </Box>
  )
}

interface Props extends InjectedIntlProps {
  group: SubscriptionsGroup
}

export default injectIntl(SubscriptionTotalsSummary)
