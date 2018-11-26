import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

import EditData from './EditData'
import DisplayData from './DisplayData'
import Toast from '../../../commons/Toast'

class DataCardContainer extends Component {
  state = {
    isEditMode: false,
    showSuccessAlert: false,
    showErrorAlert: false,
  }

  handleCloseSuccessAlert = () => {
    this.setState({
      showSuccessAlert: false,
    })
  }

  handleEditClick = () => {
    this.setState({ isEditMode: true })
  }

  handleCancelClick = () => {
    this.setState({ isEditMode: false })
  }

  handleSaveClick = () => {
    this.setState({
      isEditMode: false,
      showSuccessAlert: true,
    })
  }

  render() {
    const { intl, subscription } = this.props
    const { showSuccessAlert, isEditMode } = this.state

    if (isEditMode) {
      return (
        <EditData
          onSave={this.handleSaveClick}
          onCancel={this.handleCancelClick}
          subscription={subscription}
        />
      )
    }
    return (
      <Fragment>
        {showSuccessAlert && (
          <Toast
            message={intl.formatMessage({
              id: 'subscription.edit.success',
            })}
            onClose={this.handleCloseSuccessAlert}
          />
        )}
        <DisplayData
          onEdit={this.handleEditClick}
          subscription={subscription}
        />
      </Fragment>
    )
  }
}

DataCardContainer.propTypes = {
  subscription: PropTypes.object.isRequired,
  updateSettings: PropTypes.func,
  intl: intlShape.isRequired,
}

export default injectIntl(DataCardContainer)
