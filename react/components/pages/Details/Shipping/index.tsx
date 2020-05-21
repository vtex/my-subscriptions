import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import qs from 'query-string'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { MutationUpdateAddressArgs } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import UPDATE_ADDRESS from '../../../../graphql/updateAddress.gql'
import EditShipping from './EditShipping'
import ShippingCard from './ShippingCard'
import { SubscriptionsGroup } from '..'
import {
  BASIC_CARD_WRAPPER,
  CSS,
  ADDRESS_DIV_ID,
  EditOptions,
} from '../../../../constants'
import {
  getEditOption,
  scrollToElement,
  removeElementsFromSearch,
} from '../../../../utils'
import { logGraphqlError } from '../../../../tracking'

function hasEditOption(location: RouteComponentProps['location']) {
  const option = getEditOption(location)

  return option === EditOptions.Address
}

function newAddressArgs(location: RouteComponentProps['location']) {
  const args = qs.parse(location.search)

  if (args.newAddressId) {
    return {
      selectedAddressId: args.newAddressId,
      isEditMode: true,
    }
  }

  return null
}

class ShippingContainer extends Component<Props, State> {
  constructor(props: Props) {
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

  public componentDidMount = () => {
    const hasEdited = this.verifyEdit()

    if (!hasEdited) {
      this.verifyNewAddress()
    }
  }

  private verifyEdit = () => {
    const { location } = this.props
    const shouldOpenEdit = hasEditOption(location)

    if (shouldOpenEdit) {
      this.setState({ isEditMode: shouldOpenEdit }, () => {
        scrollToElement(ADDRESS_DIV_ID)

        const search = removeElementsFromSearch(['edit'], location)

        this.props.history.push({
          search,
        })
      })
    }

    return shouldOpenEdit
  }

  private verifyNewAddress = () => {
    const { location, history } = this.props
    const args = newAddressArgs(location)

    if (args) {
      this.setState({ ...args }, () => {
        scrollToElement(ADDRESS_DIV_ID)

        const search = removeElementsFromSearch(['newAddressId'], location)

        history.push({
          search,
        })

        this.handleSave()
      })
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

  private handleSave = () => {
    const { group, showToast, intl } = this.props

    this.setState({ isLoading: true })

    const variables = {
      addressId: this.state.selectedAddressId,
      subscriptionsGroupId: group.id,
    }

    this.props
      .updateAddress({
        variables,
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
        logGraphqlError({
          error: e,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'UpdateAddress',
        })

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

  private handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ selectedAddressId: e.target.value })

  private handleEditClick = () => {
    const { group } = this.props

    this.setState({
      isEditMode: true,
      selectedAddressId: group.shippingAddress ? group.shippingAddress.id : '',
    })
  }

  private handleCancelClick = () => this.setState({ isEditMode: false })

  public render() {
    const { group } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAddressId,
      showErrorAlert,
      errorMessage,
    } = this.state

    return (
      <div
        className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}
        id={ADDRESS_DIV_ID}
      >
        {isEditMode ? (
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
        )}
      </div>
    )
  }
}

interface OuterProps {
  group: SubscriptionsGroup
}

interface InnerProps
  extends RouteComponentProps,
    InjectedIntlProps,
    InjectedRuntimeContext {
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
  selectedAddressId: string
}

export default compose<Props, OuterProps>(
  injectIntl,
  withToast,
  withRouter,
  graphql(UPDATE_ADDRESS, {
    name: 'updateAddress',
  }),
  withRuntimeContext
)(ShippingContainer)
