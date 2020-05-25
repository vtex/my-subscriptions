import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import { Total } from 'vtex.subscriptions-graphql'

import FormattedPrice from '../FormattedPrice'

const messages = defineMessages({
  total: { id: 'store/subscription.summary.total', defaultMessage: '' },
  // TODO: use Totatlizer translation
  orderId: { id: 'store/subscription.summary.orderId', defaultMessage: '' },
  value: { id: 'store/subscription.summary.value', defaultMessage: '' },
  totalValue: {
    id: 'store/subscription.summary.totalValue',
    defaultMessage: '',
  },
  items: { id: 'store/subscription.summary.items', defaultMessage: '' },
  shipping: { id: 'store/subscription.summary.shipping', defaultMessage: '' },
  discounts: { id: 'store/subscription.summary.discounts', defaultMessage: '' },
  quantity: { id: 'store/subscription.summary.quantity', defaultMessage: '' },
})

const SubscriptionTotals: FunctionComponent<Props> = ({
  totals,
  currencyCode,
  intl,
}) => {
  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return (
    <div className="w-100">
      {totals?.map((total) => {
        return (
          <div className="cf pt2" key={total.id}>
            <div className="dib f6 fw4 c-muted-1 w-40">
              {intl.formatMessage({
                id: `store/subscription.summary.${total.id.toLowerCase()}`,
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
          {intl.formatMessage(messages.total)}
        </div>
        <div className="dib f6 fw5 c-muted-1 w-60 tr">
          <FormattedPrice value={fullPrice} currency={currencyCode} />
        </div>
      </div>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  totals: Total[]
  currencyCode: string
}

export default injectIntl(SubscriptionTotals)
