import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { compose } from 'recompose'
import { withToast } from 'vtex.styleguide'

import UPDATE_ADDRESS from '../../../../graphql/updateAddress.gql'
import EditShipping from './EditShipping'
import ShippingCard from './ShippingCard'

class ShippingContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
  public state = {
    errorMessage: '',
    isEditMode: false,
    isLoading: false,
    selectedAddressId: '',
    showErrorAlert: false,
  }

  public handleGoToCreateAddress = () => {
    const { history } = this.props

    const here = history.location.pathname

    history.push({
      pathname: '/addresses/new',
      search: `?returnUrl=${here}`,
    })
  }

  public handleCloseErrorAlert = () => {
    this.setState({ showErrorAlert: false })
  }

  public handleSave = () => {
    const { intl, subscriptionsGroup, showToast } = this.props

    this.setState({ isLoading: true })
    this.props
      .updateAddress({
        variables: {
          addressId: this.state.selectedAddressId,
          orderGroup: subscriptionsGroup.orderGroup,
        },
      })
      .then(() => {
        this.setState({
          isEditMode: false,
          isLoading: false,
        })
        showToast({
          message: intl.formatMessage({
            id: 'subscription.edit.success',
          }),
        })
      })
      .catch((e: any) => {
        this.setState({
          errorMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
          isLoading: false,
          showErrorAlert: true,
        })
      })
  }

  public handleAddressChange = (e: any) => {
    this.setState({ selectedAddressId: e.target.value })
  }

  public handleEditClick = () => {
    this.setState({ isEditMode: true })
  }

  public handleCancelClick = () => {
    this.setState({ isEditMode: false })
  }

  public render() {
    const { subscriptionsGroup } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAddressId,
      showErrorAlert,
      errorMessage,
    } = this.state

    return isEditMode ? (
      <EditShipping
        onSave={this.handleSave}
        onCancel={this.handleCancelClick}
        onChangeAddress={this.handleAddressChange}
        onCloseErrorAlert={this.handleCloseErrorAlert}
        onGoToCreateAddress={this.handleGoToCreateAddress}
        selectedAddressId={selectedAddressId}
        isLoading={isLoading}
        showErrorAlert={showErrorAlert}
        errorMessage={errorMessage}
        subscriptionsGroup={subscriptionsGroup}
      />
    ) : (
      <ShippingCard
        onEdit={this.handleEditClick}
        subscriptionsGroup={subscriptionsGroup}
      />
    )
  }
}

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
  history: any
}

interface InnerProps {
  updateAddress: (args: UpdateAddressMutationArgs) => Promise<any>
  showToast: (args: object) => void
}

export default compose<any, Props>(
  injectIntl,
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  }),
  withToast,
  withRouter
)(ShippingContainer)
