import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import { intlShape, injectIntl } from 'react-intl'

import { subscriptionsGroupShape } from '../../../../proptypes'
import UpdatePaymentMethod from '../../../../graphql/updatePaymentMethod.gql'
import Toast from '../../../commons/Toast'
import PaymentCard from './PaymentCard'
import EditPayment from './EditPayment'

class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditMode: false,
      account: props.subscriptionsGroup.purchaseSettings.paymentMethod
        .paymentAccount
        ? props.subscriptionsGroup.purchaseSettings.paymentMethod.paymentAccount
            .accountId
        : undefined,
      paymentSystem:
        props.subscriptionsGroup.purchaseSettings.paymentMethod.paymentSystem,
      paymentSystemGroup:
        props.subscriptionsGroup.purchaseSettings.paymentMethod
          .paymentSystemGroup,
      isLoading: false,
      showSuccessAlert: false,
      showErrorAlert: false,
      isRetryButtonEnabled: true,
    }
  }

  componentDidMount = () => {
    this.mounted = true
  }

  componentWillUnmount = () => {
    this.mounted = false
  }

  handleMakeRetry = () => {
    const { onMakeRetry } = this.props

    onMakeRetry().then(() => {
      this.mounted &&
        this.setState({
          isRetryButtonEnabled: false,
        })
    })
  }

  handleEdit = () => {
    this.setState({ isEditMode: true })
  }

  handleCancel = () => {
    this.setState({ isEditMode: false })
  }

  handleSave = () => {
    this.setState({ isLoading: true })
    this.props
      .updatePayment({
        variables: {
          orderGroup: this.props.subscriptionsGroup.orderGroup,
          payment: this.state.paymentSystem,
          accountId:
            this.state.paymentSystemGroup === 'creditCard'
              ? this.state.account
              : null,
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

  handleCloseSuccessAlert = () => {
    this.setState({
      showSuccessAlert: false,
    })
  }

  handlePaymentChange = e => {
    this.setState({
      paymentSystem: e.target.value,
      paymentSystemGroup: e.target.name,
    })
  }

  handleCardChange = e => {
    this.setState({ account: e.target.value })
  }

  render() {
    const { subscriptionsGroup, displayRetry } = this.props
    const {
      isEditMode,
      account,
      isLoading,
      paymentSystemGroup,
      showErrorAlert,
      showSuccessAlert,
      isRetryButtonEnabled,
    } = this.state

    if (isEditMode) {
      return (
        <EditPayment
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          onChangePayment={this.handlePaymentChange}
          onChangeCard={this.handleCardChange}
          paymentSystemGroup={paymentSystemGroup}
          showErrorAlert={showErrorAlert}
          errorMessage={this.state.errorMessage}
          orderGroup={subscriptionsGroup.orderGroup}
          account={account}
          isLoading={isLoading}
        />
      )
    }

    return (
      <div>
        {showSuccessAlert && (
          <div className="absolute top-2 z-5 ma7">
            <Toast
              message={this.props.intl.formatMessage({
                id: 'subscription.edit.success',
              })}
              onClose={this.handleCloseSuccessAlert}
            />
          </div>
        )}
        <PaymentCard
          onEdit={this.handleEdit}
          subscriptionsGroup={subscriptionsGroup}
          onMakeRetry={this.handleMakeRetry}
          displayRetry={displayRetry}
          isRetryButtonEnabled={isRetryButtonEnabled}
        />
      </div>
    )
  }
}

Payment.propTypes = {
  intl: intlShape.isRequired,
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  updatePayment: PropTypes.func.isRequired,
  onMakeRetry: PropTypes.func.isRequired,
  displayRetry: PropTypes.bool.isRequired,
}

const paymentMutation = {
  name: 'updatePayment',
  options({ subscriptionsGroup, paymentSystem, accountId }) {
    return {
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
        payment: paymentSystem,
        account: accountId,
      },
    }
  },
}

export default compose(graphql(UpdatePaymentMethod, paymentMutation))(
  injectIntl(Payment)
)
