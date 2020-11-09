import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EmptyState as Empty } from 'vtex.styleguide'

import Icon from './IconBox'

const EMPTY_MESSAGE = <FormattedMessage id="add-item-modal.empty-message" />

const NO_RESULTS_MESSAGE = (
  <FormattedMessage id="add-item-modal.no-results-message" />
)

const EmptyState: FunctionComponent<Props> = ({ state }) => {
  return (
    <Empty title={<Icon />}>
      <div className="mt5">
        {state === 'empty' ? EMPTY_MESSAGE : NO_RESULTS_MESSAGE}
      </div>
    </Empty>
  )
}

interface Props {
  state: 'empty' | 'no-results'
}

export default EmptyState
