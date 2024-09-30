import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { SkeletonPiece } from 'vtex.my-account-commons'

import Box from '../CustomBox'

const SummarySkeleton: FunctionComponent = () => (
  <div className="pt6">
    <Box
      title={<FormattedMessage id="summary.title" />}
      footer={
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
      }
    >
      <div className="ph7 pb7">
        <div className="w-100">
          <SkeletonPiece size="4" />
        </div>
        <div className="w-100 mt4">
          <SkeletonPiece size="4" />
        </div>
        <div className="w-100 mt4">
          <SkeletonPiece size="4" />
        </div>
      </div>
    </Box>
  </div>
)

export default SummarySkeleton
