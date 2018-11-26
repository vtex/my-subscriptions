import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Button, Modal } from 'vtex.styleguide'

class RemoveItemConfirmModal extends Component {
  render() {
    const { onClose, isModalOpen, isLoading, intl } = this.props

    return (
      <Modal centered isOpen={isModalOpen} onClose={onClose}>
        <span className="db b f5">
          {intl.formatMessage({
            id: 'subscription.itemCancel.title',
          })}
        </span>
        <span className="db pt6">
          {intl.formatMessage({
            id: 'subscription.itemCancel.text',
          })}
        </span>

        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button size="small" variation="tertiary" onClick={onClose}>
              {intl.formatMessage({ id: 'commons.no' })}
            </Button>
          </span>
          <Button
            size="small"
            variation="primary"
            isLoading={isLoading}
            onClick={this.props.onSave}
          >
            {intl.formatMessage({ id: 'commons.yes' })}
          </Button>
        </div>
      </Modal>
    )
  }
}

RemoveItemConfirmModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(RemoveItemConfirmModal)
