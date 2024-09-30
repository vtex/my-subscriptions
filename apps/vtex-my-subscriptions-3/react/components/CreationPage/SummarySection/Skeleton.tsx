import type { FunctionComponent } from 'react'
import React from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'

const SummarySectionSkeleton: FunctionComponent = () => (
  <Box>
    <Section borderBottom>
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

export default SummarySectionSkeleton
