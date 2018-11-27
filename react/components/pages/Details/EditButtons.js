import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

class EditButtons extends Component {
  render() {
    const { onCancel, onSave, isLoading, intl, disabled } = this.props
    return (
      <div className="ml-auto">
        <div className="flex flex-row">
          <div className="pr3">
            <Button size="small" onClick={onCancel} variation="secondary">
              {intl.formatMessage({
                id: 'commons.cancel',
              })}
            </Button>
          </div>
          <Button
            size="small"
            onClick={onSave}
            variation="primary"
            isLoading={isLoading}
            disabled={disabled}>
            {intl.formatMessage({
              id: 'subscription.actions.save',
            })}
          </Button>
        </div>
      </div>
    )
  }
}

EditButtons.defaultProps = {
  disabled: false,
}

EditButtons.propTypes = {
  isLoading: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  disabled: PropTypes.bool,
}

export default injectIntl(EditButtons)
