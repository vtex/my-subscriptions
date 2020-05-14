import React, { FunctionComponent } from 'react'
import { FormattedMessage, MessageDescriptor } from 'react-intl'

const CardHeader: FunctionComponent<Props> = ({ title, children }) => (
  <div className="flex h2">
    <div className="db-s di-ns b f4 tl c-on-base">
      <FormattedMessage {...title} />
    </div>
    <div className="ml-auto">{children}</div>
  </div>
)

interface Props {
  title: MessageDescriptor
}

export default CardHeader
