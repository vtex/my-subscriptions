import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { withToast } from 'vtex.styleguide'
import { path } from 'ramda'

import UpdatePaymentMethod from '../../../../graphql/updatePaymentMethod.gql'
import EditPayment from './EditPayment'
import PaymentCard from './PaymentCard'

class SubscriptionsGroupPaymentContainer extends Component<
  InnerProps & OuterProps,
  State
> {
  private mounted: boolean

  constructor(props: InnerProps & OuterProps) {
    super(props)
    this.state = {
      account:
        path(
          [
            'subscriptionsGroup',
            'purchaseSettings',
            'paymentMethod',
            'paymentAccount',
            'accountId',
          ],
          props
        ) || null,
      errorMessage: '',
      isEditMode: false,
      isLoading: false,
      isRetryButtonEnabled: true,
      paymentSystem:
        path(
          [
            'subscriptionsGroup',
            'purchaseSettings',
            'paymentMethod',
            'paymentSystem',
          ],
          props
        ) || null,
      paymentSystemGroup:
        path(
          [
            'subscriptionsGroup',
            'purchaseSettings',
            'paymentMethod',
            'paymentSystemGroup',
          ],
          props
        ) || null,
      showAlert: false,
    }

    this.mounted = false
  }

  public componentDidMount = () => {
    this.mounted = true
  }

  public componentWillUnmount = () => {
    this.mounted = false
  }

  public handleMakeRetry = () => {
    this.props.onMakeRetry().then(() => {
      if (this.mounted) {
        this.setState({
          isRetryButtonEnabled: false,
        })
      }
    })
  }

  public handleEdit = () => {
    this.setState({ isEditMode: true })
  }

  public handleCancel = () => {
    this.setState({ isEditMode: false })
  }

  public handleSave = () => {
    const { updatePayment, subscriptionsGroup, intl, showToast } = this.props
    const { paymentSystemGroup, account, paymentSystem } = this.state

    this.setState({ isLoading: true })
    updatePayment({
      variables: {
        accountId: paymentSystemGroup === 'creditCard' ? account : null,
        orderGroup: subscriptionsGroup.orderGroup,
        payment: paymentSystem as string,
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
      .catch(e => {
        this.setState({
          errorMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
          isLoading: false,
          showAlert: true,
        })
      })
  }

  public handleCloseAlert = () => {
    this.setState({
      showAlert: false,
    })
  }

  public handlePaymentChange = (e: any) => {
    this.setState({
      paymentSystem: e.target.value,
      paymentSystemGroup: e.target.name,
    })
  }

  public handleCardChange = (e: any) => {
    this.setState({ account: e.target.value })
  }

  public render() {
    const { subscriptionsGroup, displayRetry } = this.props
    const {
      isEditMode,
      account,
      isLoading,
      paymentSystemGroup,
      showAlert,
      isRetryButtonEnabled,
    } = this.state

    if (isEditMode) {
      return (
        <EditPayment
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          onChangePayment={this.handlePaymentChange}
          onChangeCard={this.handleCardChange}
          onCloseAlert={this.handleCloseAlert}
          paymentSystemGroup={paymentSystemGroup}
          showAlert={showAlert}
          errorMessage={this.state.errorMessage}
          orderGroup={subscriptionsGroup.orderGroup}
          account={account}
          isLoading={isLoading}
        />
      )
    }

    return (
      <PaymentCard
        onEdit={this.handleEdit}
        subscriptionsGroup={subscriptionsGroup}
        onMakeRetry={this.handleMakeRetry}
        displayRetry={displayRetry}
        isRetryButtonEnabled={isRetryButtonEnabled}
      />
    )
  }
}

interface OuterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  onMakeRetry: () => Promise<void>
  displayRetry: boolean
}

interface InnerProps extends InjectedIntlProps {
  updatePayment: (args: Variables<UpdatePaymentArgs>) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
}

interface State {
  account: string | null
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  isRetryButtonEnabled: boolean
  paymentSystem: string | null
  paymentSystemGroup: string | null
  showAlert: boolean
}

const paymentMutation = {
  name: 'updatePayment',
}

export default compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  withToast,
  graphql(UpdatePaymentMethod, paymentMutation)
)(SubscriptionsGroupPaymentContainer)
