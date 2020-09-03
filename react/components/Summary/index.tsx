import React, { FunctionComponent } from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { Total } from 'vtex.subscriptions-graphql'

import Box from '../CustomBox'
import Content from './Content'

const Summary: FunctionComponent<Props> = ({ totals = [], currencyCode }) => {
  if (totals.length === 0) return null

  return (
    <Box
      title={
        <FormattedMessage id="store/summary.title" defaultMessage="Summary" />
      }
      footer={
        <FormattedMessage
          id="store/summary.price-warning"
          defaultMessage="*Prices valid until {day}"
          values={{
            day: (
              <FormattedDate value={new Date()} month="long" day="2-digit" />
            ),
          }}
        />
      }
    >
      <div className="ph7 pb7">
        <Content totals={totals} currencyCode={currencyCode} />
      </div>
    </Box>
  )
}

type Props = {
  totals?: Total[]
  currencyCode: string
}

export default Summary
