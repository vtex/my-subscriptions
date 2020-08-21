import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import qs from 'query-string'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import UPDATE_ADDRESS, {
  Args,
} from '../../../graphql/mutations/updateAddress.gql'
import EditShipping from './EditShipping'
import ShippingCard from './ShippingCard'
import { Subscription } from '..'
import BatchModal from '../BatchModal'
import {
  BASIC_CARD_WRAPPER,
  CSS,
  ADDRESS_DIV_ID,
  EditOptions,
} from '../../../constants'
import {
  getEditOption,
  scrollToElement,
  removeElementsFromSearch,
} from '../../../utils'
import { logGraphqlError } from '../../../tracking'

function hasEditOption(location: RouteComponentProps['location']) {
  const option = getEditOption(location)

  return option === EditOptions.Address
}

function newAddressArgs(location: RouteComponentProps['location']) {
  const args = qs.parse(location.search)

  if (args.newAddressId) {
    return {
      selectedAddress: { id: args.newAddressId, type: 'residential' }, // todo verify address type
      isEditMode: true,
    }
  }

  return null
}

const messages = defineMessages({
  success: {
    id: 'store/subscription.edit.success',
    defaultMessage: '',
  },
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
  },
})

class ShippingContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      errorMessage: '',
      isBatchModalOpen: false,
      isEditMode: false,
      isLoading: false,
      showErrorAlert: false,
      previousAddress: null,
      selectedAddress: props.subscription.shippingAddress
        ? {
            id: props.subscription.shippingAddress.id,
            type: props.subscription.shippingAddress.addressType as string,
          }
        : null,
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
    const { subscription, showToast, intl } = this.props

    this.setState({
      isLoading: true,
      previousAddress: subscription.addressId,
    })

    const variables = {
      addressId: this.state.selectedAddress?.id as string,
      subscriptionId: subscription.id,
      addressType: this.state.selectedAddress?.type as string,
    }

    this.props
      .updateAddress({
        variables,
      })
      .then(() => {
        showToast({
          message: intl.formatMessage(messages.success),
        })

        this.setState({
          isEditMode: false,
          isLoading: false,
          isBatchModalOpen: true,
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
          errorMessage: intl.formatMessage(messages.errorMessage),
          isLoading: false,
          showErrorAlert: true,
        })
      })
  }

  private handleAddressChange = (id: string, type: string) =>
    this.setState({ selectedAddress: { id, type } })

  private handleEditClick = () => {
    const { subscription } = this.props

    this.setState({
      isEditMode: true,
      selectedAddress: subscription.shippingAddress
        ? {
            id: subscription.shippingAddress.id,
            type: subscription.shippingAddress.addressType as string,
          }
        : { id: '', type: '' },
    })
  }

  private handleCancelClick = () => this.setState({ isEditMode: false })

  private handleOnCloseBatch = () => this.setState({ isBatchModalOpen: false })

  public render() {
    const { subscription } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAddress,
      showErrorAlert,
      errorMessage,
      isBatchModalOpen,
      previousAddress,
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
            selectedAddress={selectedAddress}
            isLoading={isLoading}
            showErrorAlert={showErrorAlert}
            errorMessage={errorMessage}
            currentAddressId={subscription.addressId}
          />
        ) : (
          <>
            {isBatchModalOpen && previousAddress && (
              <BatchModal
                onClose={this.handleOnCloseBatch}
                currentSubscription={subscription}
                option="ADDRESS"
                value={previousAddress}
              />
            )}
            <ShippingCard
              onEdit={this.handleEditClick}
              subscription={subscription}
            />
          </>
        )}
      </div>
    )
  }
}

interface OuterProps {
  subscription: Subscription
}

interface InnerProps
  extends RouteComponentProps,
    WrappedComponentProps,
    InjectedRuntimeContext {
  updateAddress: (args: { variables: Args }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

type Props = InnerProps & OuterProps

interface State {
  isBatchModalOpen: boolean
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  showErrorAlert: boolean
  selectedAddress: { id: string; type: string } | null
  previousAddress: string | null
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
