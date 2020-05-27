import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Total } from 'vtex.subscriptions-graphql'
import { TranslateTotalizer } from 'vtex.totalizer-translator'

import FormattedPrice from './FormattedPrice'

const SubscriptionTotals: FunctionComponent<Props> = ({
  totals,
  currencyCode,
}) => {
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return (
    <div className="w-100">
      {totals?.map((total) => {
        return (
          <div className="cf pt2" key={total.id}>
            <div className="dib f6 fw4 c-muted-1 w-40">
              <TranslateTotalizer id={total.id} />
            </div>
            <div className="dib f6 fw4 c-muted-1 tr w-60">
              <FormattedPrice value={total.value} currency={currencyCode} />
            </div>
          </div>
        )
      })}
      <div className="pt2">
        <div className="dib fl f6 fw5 c-muted-1 w-40">
          <FormattedMessage id="store/subscription.summary.totalValue" />
        </div>
        <div className="dib f6 fw5 c-muted-1 w-60 tr">
          <FormattedPrice value={fullPrice} currency={currencyCode} />
        </div>
      </div>
    </div>
  )
}

interface Props {
  totals: Total[]
  currencyCode: string
}

export default SubscriptionTotals
