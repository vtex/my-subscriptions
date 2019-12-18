import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
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
  public constructor(props: Props) {
    super(props)

    this.state = {
      errorMessage: '',
      isEditMode: false,
      isLoading: false,
      showErrorAlert: false,
      selectedAddressId: props.group.shippingAddress
        ? props.group.shippingAddress.id
        : '',
    }
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

    this.setState({ isLoading: true })
    this.props
      .updateAddress({
        variables: {
          addressId: this.state.selectedAddressId,
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
          errorMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
          isLoading: false,
          showErrorAlert: true,
        })
      })
  }

  public handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ selectedAddressId: e.target.value })

  public handleEditClick = () => {
    const { group } = this.props

    this.setState({
      isEditMode: true,
      selectedAddressId: group.shippingAddress ? group.shippingAddress.id : '',
    })
  }

  public handleCancelClick = () => this.setState({ isEditMode: false })

  public render() {
    const { group } = this.props
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
        group={group}
      />
    ) : (
      <ShippingCard onEdit={this.handleEditClick} group={group} />
    )
  }
}

interface OutterProps {
  group: SubscriptionsGroup
}

interface InnerProps extends RouteComponentProps, InjectedIntlProps {
  updateAddress: (args: {
    variables: MutationUpdateAddressArgs
  }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

type Props = InnerProps & OutterProps

interface State {
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  showErrorAlert: boolean
  selectedAddressId: string
}

export default compose<Props, OutterProps>(
  injectIntl,
  withToast,
  withRouter,
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  })
)(ShippingContainer)
