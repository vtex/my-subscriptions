import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { SkeletonPiece } from 'vtex.my-account-commons'

import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'

const PreferencesSkeleton: FunctionComponent = () => (
  <Box title={<FormattedMessage id="store/details-page.preferences.title" />}>
    <Section borderTop borderBottom>
      <SkeletonPiece width="50" size="4" />
      <div className="mt6">
        <SkeletonPiece width="50" size="4" />
      </div>
    </Section>
    <Section borderBottom>
      <SkeletonPiece width="50" size="4" />
    </Section>
    <Section borderBottom>
      <SkeletonPiece width="50" size="4" />
    </Section>
  </Box>
)

export default PreferencesSkeleton
