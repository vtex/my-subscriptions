import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'
import { SkeletonPiece } from 'vtex.my-account-commons'

const PreferencesSkeleton: FunctionComponent = () => (
  <Box title={<FormattedMessage id="store/details-page.preferences.title" />}>
    <SkeletonPiece width="50" size="4" />
    <div className="mt7">
      <SkeletonPiece width="50" size="4" />
    </div>
    <div className="mt7">
      <SkeletonPiece width="50" size="4" />
    </div>
  </Box>
)

export default PreferencesSkeleton
