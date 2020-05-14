import React, { Fragment, FunctionComponent, ReactNode } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'

const LabeledInfo: FunctionComponent<Props & WrappedComponentProps> = ({
  label,
  labelId,
  children,
  intl,
}) => {
  return (
    <Fragment>
      <span className="b db f5-ns f6-s c-on-base">
        {labelId ? intl.formatMessage({ id: labelId }) : label}
      </span>
      <span className="db fw3 f5-ns f6-s c-on-base mt2">{children}</span>
    </Fragment>
  )
}

interface Props {
  label?: ReactNode
  labelId?: string
  children: ReactNode
}

export default injectIntl(LabeledInfo)
