import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import FormattedPrice from '../../commons/FormattedPrice'

const SubscriptionTotals: FunctionComponent<Props> = ({
  totals,
  currencyCode,
  intl,
}) => {
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return (
    <div className="w-100">
      {totals &&
        totals.map(total => {
          return (
            <div className="cf pt2" key={total.id}>
              <div className="dib f6 fw4 c-muted-1 w-40">
                {intl.formatMessage({
                  id: `subscription.summary.${total.id.toLowerCase()}`,
                })}
              </div>
              <div className="dib f6 fw4 c-muted-1 tr w-60">
                <FormattedPrice value={total.value} currency={currencyCode} />
              </div>
            </div>
          )
        })}

      <div className="pt2">
        <div className="dib fl f6 fw5 c-muted-1 w-40">
          {intl.formatMessage({ id: 'order.summary.total' })}
        </div>
        <div className="dib f6 fw5 c-muted-1 w-60 tr">
          <FormattedPrice value={fullPrice} currency={currencyCode} />
        </div>
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  totals: TotalType[]
  currencyCode: string
}

export default injectIntl(SubscriptionTotals)
