import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { compose } from 'recompose'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'
import { MutationUpdateAddressArgs } from 'vtex.subscriptions-graphql'

import UPDATE_ADDRESS from '../../../../graphql/updateAddress.gql'
import EditShipping from './EditShipping'
import ShippingCard from './ShippingCard'

import { SubscriptionsGroup } from '..'

class ShippingContainer extends Component<Props, State> {
  public state = {
    errorMessage: '',
    isEditMode: false,
    isLoading: false,
    showErrorAlert: false,
    selectedAddress: {
      id: '',
      type: '',
    },
  }

  private handleGoToCreateAddress = () => {
    const { history } = this.props

    const here = history.location.pathname

    history.push({
      pathname: '/addresses/new',
      search: `?returnUrl=${here}`,
    })
  }

  private handleCloseErrorAlert = () => this.setState({ showErrorAlert: false })

  public handleSave = () => {
    const { group, showToast, intl } = this.props
    const { selectedAddress } = this.state

    this.setState({ isLoading: true })

    this.props
      .updateAddress({
        variables: {
          addressType: selectedAddress.type,
          addressId: selectedAddress.id,
          subscriptionsGroupId: group.id,
        },
      })
      .then(() => {
        showToast({
          message: intl.formatMessage({
            id: 'subscription.edit.success',
          }),
        })

        this.setState({
          isEditMode: false,
          isLoading: false,
        })
      })
      .catch((e: ApolloError) => {
        this.setState({
          errorMessage: `subscription.fetch.${
            e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()
          }`,
          isLoading: false,
          showErrorAlert: true,
        })
      })
  }

  public handleAddressChange = (id: string, type: string) =>
    this.setState({ selectedAddress: { id, type } })

  public handleEditClick = () => {
    const { group } = this.props

    this.setState({
      isEditMode: true,
      selectedAddress: {
        id: group.shippingAddress ? group.shippingAddress.id : '',
        type: group.shippingAddress
          ? (group.shippingAddress.addressType as string)
          : '',
      },
    })
  }

  public handleCancelClick = () => this.setState({ isEditMode: false })

  public render() {
    const { group } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAddress,
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
        selectedAddress={selectedAddress}
        isLoading={isLoading}
        showErrorAlert={showErrorAlert}
        errorMessage={errorMessage}
        group={group}
      />
    ) : (
      <ShippingCard onEdit={this.handleEditClick} group={group} />
    )
  }
}

interface OuterProps {
  group: SubscriptionsGroup
}

interface InnerProps extends RouteComponentProps, WrappedComponentProps {
  updateAddress: (args: {
    variables: MutationUpdateAddressArgs
  }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

type Props = InnerProps & OuterProps

interface State {
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  showErrorAlert: boolean
  selectedAddress: {
    id: string
    type: string
  }
}

export default compose<Props, OuterProps>(
  injectIntl,
  withToast,
  withRouter,
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  })
)(ShippingContainer)
