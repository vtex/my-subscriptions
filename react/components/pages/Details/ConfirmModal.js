import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import { Button, Modal } from 'vtex.styleguide'

import UpdateStatus from '../../../graphql/updateStatus.gql'
import { subscriptionsGroupShape } from '../../../proptypes'

class ConfirmModal extends Component {
  state = {
    isLoading: false,
  }

  updateStatus(status) {
    this.props
      .updateStatus({
        variables: {
          status: status,
          orderGroup: this.props.subscriptionsGroup.orderGroup,
        },
      })
      .then(() => {
        this.setState({ isLoading: false })
        this.props.onSuccessUpdate()
      })
      .catch(() => {
        this.setState({ isLoading: false })
        this.props.onErrorUpdate()
      })
  }

  handleUpdateStatus = () => {
    const { updateType } = this.props
    this.setState({ isLoading: true })
    updateType === 'restore'
      ? this.updateStatus('ACTIVE')
      : updateType === 'cancel'
      ? this.updateStatus('CANCELED')
      : this.updateStatus('PAUSED')
  }

  render() {
    const { onClose, isModalOpen, updateType } = this.props
    return (
      <Modal centered isOpen={isModalOpen} onClose={onClose}>
        <span className="db b f5">
          {this.props.intl.formatMessage({
            id:
              updateType === 'restore'
                ? 'subscription.restore.title'
                : updateType === 'cancel'
                ? 'subscription.cancel.title'
                : 'subscription.pause.title',
          })}
        </span>
        <span className="db pt6">
          {this.props.intl.formatMessage({
            id:
              updateType === 'restore'
                ? 'subscription.restore.text'
                : updateType === 'cancel'
                ? 'subscription.cancel.text'
                : 'subscription.pause.text',
          })}
        </span>

        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button size="small" variation="tertiary" onClick={onClose}>
              {this.props.intl.formatMessage({ id: 'commons.no' })}
            </Button>
          </span>
          <Button
            size="small"
            variation="primary"
            isLoading={this.state.isLoading}
            onClick={this.handleUpdateStatus}>
            {this.props.intl.formatMessage({ id: 'commons.yes' })}
          </Button>
        </div>
      </Modal>
    )
  }
}

ConfirmModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccessUpdate: PropTypes.func.isRequired,
  onErrorUpdate: PropTypes.func.isRequired,
  updateStatus: PropTypes.func,
  isModalOpen: PropTypes.bool.isRequired,
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  intl: intlShape.isRequired,
  subscriptionsData: PropTypes.object,
  updateType: PropTypes.string.isRequired,
}

const updateStatusMutation = {
  name: 'updateStatus',
  options({ subscriptionsGroup, status }) {
    return {
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
        status: status,
      },
    }
  },
}

export default compose(graphql(UpdateStatus, updateStatusMutation))(
  injectIntl(ConfirmModal)
)
