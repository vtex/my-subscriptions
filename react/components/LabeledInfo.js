import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

const LabeledInfo = ({ label, labelId, children, intl }) => {
  return (
    <Fragment>
      <span className="b db f5-ns f6-s c-on-base">
        {labelId ? intl.formatMessage({ id: labelId }) : label}
      </span>
      <span className="db fw3 f5-ns f6-s c-on-base mt2">{children}</span>
    </Fragment>
  )
}

LabeledInfo.propTypes = {
  label: PropTypes.any,
  labelId: PropTypes.string,
  children: PropTypes.any,
  intl: intlShape.isRequired,
}

export default injectIntl(LabeledInfo)
