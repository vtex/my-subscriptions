import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'
import type { Total } from 'vtex.subscriptions-graphql'
import { TranslateTotalizer } from 'vtex.totalizer-translator'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'summaryRow',
  'summaryItems',
  'summaryDiscounts',
  'summaryShipping',
  'summaryTax',
  'summaryInterest',
  'summaryChange',
  'summaryOther',
  'summaryTotal',
]

const SummaryContent: FunctionComponent<Props> = ({ totals, currencyCode }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const taxTotals = totals.filter(total =>
    total.id.toLowerCase().includes('tax')
  )

  const nonTaxTotals = totals.filter(
    total => !total.id.toLowerCase().includes('tax')
  )

  const totalTax = taxTotals?.reduce((price, total) => price + total.value, 0)
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return (
    <div className="t-body">
      {nonTaxTotals?.map(total => {
        return (
          <div
            className={`mb4 flex justify-between ${handles.summaryRow} ${
              handles[`summary${total.id}`] ?? handles.summaryOther
            }`}
            key={total.id}
          >
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
      {totalTax > 0 && (
        <div
          className={`mb4 flex justify-between ${handles.summaryRow} ${handles.summaryTax}`}
        >
          <span>
            <TranslateTotalizer id="Tax" nonStorePage />
          </span>
          <FormattedNumber
            currency={currencyCode}
            style="currency"
            value={totalTax / 100}
          />
        </div>
      )}
      <div
        className={`mt5 pt6 b--muted-4 bt flex justify-between b ${handles.summaryRow} ${handles.summaryTotal}`}
      >
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
