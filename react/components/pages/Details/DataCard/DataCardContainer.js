import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

import EditData from './EditData'
import DisplayData from './DisplayData'
import Toast from '../../../commons/Toast'
import { subscriptionsGroupShape } from '../../../../proptypes'

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
    const { intl, subscriptionsGroup } = this.props
    const { showSuccessAlert, isEditMode } = this.state

    if (isEditMode) {
      return (
        <EditData
          onSave={this.handleSaveClick}
          onCancel={this.handleCancelClick}
          subscriptionsGroup={subscriptionsGroup}
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
          subscriptionsGroup={subscriptionsGroup}
        />
      </Fragment>
    )
  }
}

DataCardContainer.propTypes = {
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  updateSettings: PropTypes.func,
  intl: intlShape.isRequired,
}

export default injectIntl(DataCardContainer)
