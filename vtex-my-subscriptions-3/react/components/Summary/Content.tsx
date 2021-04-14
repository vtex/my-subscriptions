import React, { FunctionComponent } from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import { Total } from 'vtex.subscriptions-graphql'
import { TranslateTotalizer } from 'vtex.totalizer-translator'

const SummaryContent: FunctionComponent<Props> = ({ totals, currencyCode }) => {
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return (
    <div className="t-body">
      {totals?.map((total) => {
        return (
          <div className="mb4 flex justify-between" key={total.id}>
            <span>
              <TranslateTotalizer id={total.id} nonStorePage />
            </span>
            <FormattedNumber
              currency={currencyCode}
              style="currency"
              value={total.value / 100}
            />
          </div>
        )
      })}
      <div className="mt5 pt6 b--muted-4 bt flex justify-between b">
        <span>
          <FormattedMessage id="subscription.summary.totalValue" />{' '}
        </span>
        <FormattedNumber
          currency={currencyCode}
          style="currency"
          value={fullPrice / 100}
        />
      </div>
    </div>
  )
}

type Props = {
  totals: Total[]
  currencyCode: string
}

export default SummaryContent
