import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Total } from 'vtex.subscriptions-graphql'

import Box from '../CustomBox'
import Content from './Content'
import Footer from './Footer'

const Summary: FunctionComponent<Props> = ({ totals = [], currencyCode }) => {
  if (totals.length === 0) return null

  return (
    <div className="pt6">
      <Box
        title={<FormattedMessage id="store/summary.title" />}
        footer={<Footer />}
      >
        <div className="ph7 pb7">
          <Content totals={totals} currencyCode={currencyCode} />
        </div>
      </Box>
    </div>
  )
}

type Props = {
  totals?: Total[]
  currencyCode: string
}

export default Summary
