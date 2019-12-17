import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

const LabeledInfo: FunctionComponent<Props> = ({ labelId, children }) => (
  <div className="t-body">
    <span className="t-small c-muted-1">
      <FormattedMessage {...labelId} />
    </span>
    <div className="mt3">{children}</div>
  </div>
)

interface Props {
  labelId: FormattedMessage.MessageDescriptor
}

export default LabeledInfo
