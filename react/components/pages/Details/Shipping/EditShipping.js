import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import MediaQuery from 'react-responsive'
import { Button, Dropdown, Alert } from 'vtex.styleguide'

import AddAddressModal from './AddAddressModal'
import ShippingSkeleton from './ShippingSkeleton'
import EditButtons from '../EditButtons'
import GET_ADDRESSES from '../../../../graphql/getAddresses.gql'

class EditShipping extends Component {
  state = {
    isModalOpen: false,
    showAlert: false,
    showModalErrorAlert: false,
  }

  handleClick = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModalSuccess = () => {
    this.setState({
      isModalOpen: false,
      showAlert: true,
      alertType: 'success',
      alertMessage: 'subscription.edit.success',
    })
  }

  handleCloseModalError = e => {
    this.setState({
      showModalErrorAlert: true,
      isModalOpen: false,
      alertType: 'error',
      alertMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
        e.graphQLErrors[0].extensions &&
        e.graphQLErrors[0].extensions.error &&
        e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  transformAddresses(addresses) {
    return addresses.map(address => {
      return {
        label: `${address.street}, ${address.number}`,
        value: address.addressId,
      }
    })
  }

  render() {
    const {
      addressesData,
      selectedAddress,
      onChangeAddress,
      showErrorAlert,
      errorMessage,
      intl,
    } = this.props
    const { addresses, loading } = addressesData
    const {
      showAlert,
      isModalOpen,
      alertType,
      alertMessage,
      showModalErrorAlert,
    } = this.state

    if (isModalOpen) {
      return (
        <AddAddressModal
          subscription={this.props.subscription}
          isModalOpen={this.state.isModalOpen}
          onClose={this.handleCloseModal}
          onCloseSuccess={this.handleCloseModalSuccess}
          onCloseError={this.handleCloseModalSuccess}
          addressesData={this.props.addressesData}
          showErrorAlert={showModalErrorAlert}
          errorMessage={alertMessage}
        />
      )
    }

    if (loading || !addresses) {
      return <ShippingSkeleton />
    }

    return (
      <div className="card-height bg-base pa6 ba bw1 b--muted-5">
        {showAlert && (
          <div className="absolute top-2 z-5 ma7">
            <Alert
              type={alertType}
              autoClose={3000}
              onClose={this.handleCloseAlert}>
              {intl.formatMessage({
                id: `${alertMessage}`,
              })}
            </Alert>
          </div>
        )}
        <div className="flex flex-row">
          <div className="db-s di-ns b f4 tl c-on-base">
            {intl.formatMessage({
              id: 'subscription.shipping',
            })}
          </div>
          <MediaQuery minWidth={1024}>
            <EditButtons
              isLoading={this.props.isLoading}
              onCancel={this.props.onCancel}
              onSave={this.props.onSave}
            />
          </MediaQuery>
        </div>
        <div className="flex pt5 w-100-s mr-auto flex-column">
          {showErrorAlert && (
            <div className="mb5">
              <Alert
                type="error"
                autoClose={3000}
                onClose={this.handleCloseErrorAlert}>
                {intl.formatMessage({
                  id: `${errorMessage}`,
                })}
              </Alert>
            </div>
          )}
          <div className="w-100">
            <Dropdown
              label={intl.formatMessage({
                id: 'subscription.shipping.address',
              })}
              options={this.transformAddresses(addresses)}
              value={selectedAddress}
              onChange={onChangeAddress}
            />
          </div>
          <div className="pt3 pb4 nl5">
            <Button
              size="small"
              variation="tertiary"
              onClick={this.handleClick}>
              {intl.formatMessage({
                id: 'subscription.shipping.newAddress',
              })}
            </Button>
          </div>
          <MediaQuery maxWidth={1024}>
            <div className="flex pt2-s pt0-ns">
              <EditButtons
                isLoading={this.props.isLoading}
                onCancel={this.props.onCancel}
                onSave={this.props.onSave}
              />
            </div>
          </MediaQuery>
        </div>
      </div>
    )
  }
}

const addressesQuery = {
  name: 'addressesData',
  options({ subscription }) {
    return {
      variables: {
        orderGroup: subscription.orderGroup,
      },
    }
  },
}

EditShipping.propTypes = {
  subscription: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isLoading: PropTypes.bool.isRequired,
  addressesData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  selectedAddress: PropTypes.string,
  onChangeAddress: PropTypes.func.isRequired,
  showErrorAlert: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
}

export default compose(graphql(GET_ADDRESSES, addressesQuery))(
  injectIntl(EditShipping)
)
