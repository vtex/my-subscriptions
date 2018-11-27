import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'

import FinalPrice from '../../commons/FinalPrice'
import Price from '../../commons/FormattedPrice'

const SubscriptionTotals = ({ totals, currencyCode, intl }) => {
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
                <Price value={total.value} currency={currencyCode} />
              </div>
            </div>
          )
        })}

      <div className="pt2">
        <div className="dib fl f6 fw5 c-muted-1 w-40">
          {intl.formatMessage({ id: 'order.summary.total' })}
        </div>
        <div className="dib f6 fw5 c-muted-1 w-60 tr">
          <FinalPrice totals={totals} currency={currencyCode} />
        </div>
      </div>
    </div>
  )
}

SubscriptionTotals.propTypes = {
  totals: PropTypes.arrayOf(PropTypes.object).isRequired,
  currencyCode: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(SubscriptionTotals)
