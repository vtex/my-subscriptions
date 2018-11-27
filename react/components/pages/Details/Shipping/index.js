import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import { intlShape, injectIntl } from 'react-intl'

import EditShipping from './EditShipping'
import ShippingCard from './ShippingCard'
import Toast from '../../../commons/Toast'
import UPDATE_ADDRESS from '../../../../graphql/updateAddress.gql'

class Shipping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditMode: false,
      selectedAddress: props.subscription.shippingAddress.addressId,
      isLoading: false,
      showSuccessAlert: false,
      showErrorAlert: false,
    }
  }

  handleCloseSuccessAlert = () => {
    this.setState({ showSuccessAlert: false })
  }

  handleCloseErrorAlert = () => {
    this.setState({ showErrorAlert: false })
  }

  handleSave = () => {
    this.setState({ isLoading: true })
    this.props
      .updateAddress({
        variables: {
          subscriptionId: this.props.subscription.orderGroup,
          addressId: this.state.selectedAddress,
        },
      })
      .then(() => {
        this.setState({
          isLoading: false,
          isEditMode: false,
          showSuccessAlert: true,
        })
      })
      .catch(e => {
        this.setState({
          showErrorAlert: true,
          isLoading: false,
          errorMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
        })
      })
  }

  handleAddressChange = e => {
    this.setState({ selectedAddress: e.target.value })
  }

  handleEditClick = () => {
    this.setState({ isEditMode: true })
  }

  handleCancelClick = () => {
    this.setState({ isEditMode: false })
  }

  render() {
    const { intl, subscription } = this.props
    const {
      showSuccessAlert,
      isEditMode,
      selectedAddress,
      isLoading,
      showErrorAlert,
      errorMessage,
    } = this.state

    if (isEditMode) {
      return (
        <EditShipping
          onSave={this.handleSave}
          onCancel={this.handleCancelClick}
          onChangeAddress={this.handleAddressChange}
          selectedAddress={selectedAddress}
          isLoading={isLoading}
          showErrorAlert={showErrorAlert}
          errorMessage={errorMessage}
          subscription={subscription}
        />
      )
    }

    return (
      <div>
        {showSuccessAlert && (
          <Toast
            message={intl.formatMessage({
              id: 'subscription.edit.success',
            })}
            onClose={this.handleCloseSuccessAlert}
          />
        )}
        <ShippingCard
          onEdit={this.handleEditClick}
          subscription={subscription}
        />
      </div>
    )
  }
}

const addressMutation = {
  name: 'updateAddress',
  options({ subscription, addressId }) {
    return {
      variables: {
        subscriptionId: subscription.orderGroup,
        addressId: addressId,
      },
    }
  },
}

Shipping.propTypes = {
  intl: intlShape.isRequired,
  subscription: PropTypes.object.isRequired,
  updateAddress: PropTypes.func.isRequired,
}

export default compose(graphql(UPDATE_ADDRESS, addressMutation))(
  injectIntl(Shipping)
)
