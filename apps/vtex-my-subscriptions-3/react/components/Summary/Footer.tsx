import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'

const SummaryFooter: FunctionComponent = () => (
  <FormattedMessage
    id="summary.price-warning"
    values={{
      day: (
        <FormattedDate
          value={new Date()}
          month="long"
          day="2-digit"
          year="numeric"
        />
      ),
    }}
  />
)

export default SummaryFooter
