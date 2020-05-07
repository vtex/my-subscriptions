import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { path } from 'ramda'
import { ApolloError } from 'apollo-client'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { MutationUpdatePaymentMethodArgs } from 'vtex.subscriptions-graphql'

import UpdatePaymentMethod from '../../../../graphql/updatePaymentMethod.gql'
import { PaymentSystemGroup } from '../../../../constants'

import EditPayment from './EditPayment'
import PaymentCard from './PaymentCard'

import { SubscriptionsGroup } from '..'

class SubscriptionsGroupPaymentContainer extends Component<Props, State> {
  private mounted: boolean

  public constructor(props: Props) {
    super(props)
    this.state = {
      selectedAccountId:
        path(
          [
            'group',
            'purchaseSettings',
            'paymentMethod',
            'paymentAccount',
            'id',
          ],
          props
        ) || null,
      errorMessage: '',
      isEditMode: false,
      isLoading: false,
      isRetryButtonEnabled: true,
      selectedPaymentSystemId:
        path(
          ['group', 'purchaseSettings', 'paymentMethod', 'paymentSystemId'],
          props
        ) || null,
      selectedPaymentSystemGroup:
        path(
          ['group', 'purchaseSettings', 'paymentMethod', 'paymentSystemGroup'],
          props
        ) || PaymentSystemGroup.CreditCard,
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
    const { updatePayment, group, intl, showToast } = this.props
    const {
      selectedPaymentSystemGroup,
      selectedAccountId,
      selectedPaymentSystemId,
    } = this.state

    this.setState({ isLoading: true })

    return updatePayment({
      variables: {
        accountId:
          selectedPaymentSystemGroup === PaymentSystemGroup.CreditCard
            ? selectedAccountId
            : null,
        subscriptionsGroupId: group.id,
        paymentSystemId: selectedPaymentSystemId as string,
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
          showAlert: true,
        })
      })
  }

  public handleCloseAlert = () => {
    this.setState({
      showAlert: false,
    })
  }

  public handlePaymentGroupChange = (
    newGroup: PaymentSystemGroup,
    paymentSystemId?: string
  ) =>
    this.setState({
      selectedPaymentSystemGroup: newGroup,
      selectedPaymentSystemId: paymentSystemId || null,
    })

  public handlePaymentChange = (
    newPaymentSystemId: string,
    newAccountID?: string
  ) =>
    this.setState({
      selectedPaymentSystemId: newPaymentSystemId,
      selectedAccountId: newAccountID || null,
    })

  public render() {
    const { group, displayRetry } = this.props
    const {
      isEditMode,
      isLoading,
      selectedAccountId,
      selectedPaymentSystemGroup,
      showAlert,
      isRetryButtonEnabled,
    } = this.state

    return isEditMode ? (
      <EditPayment
        onSave={this.handleSave}
        onCancel={this.handleCancel}
        onChangePayment={this.handlePaymentChange}
        onChangePaymentGroup={this.handlePaymentGroupChange}
        onCloseAlert={this.handleCloseAlert}
        paymentSystemGroup={selectedPaymentSystemGroup}
        showAlert={showAlert}
        errorMessage={this.state.errorMessage}
        accountId={selectedAccountId}
        isLoading={isLoading}
      />
    ) : (
      <PaymentCard
        onEdit={this.handleEdit}
        group={group}
        onMakeRetry={this.handleMakeRetry}
        displayRetry={displayRetry}
        isRetryButtonEnabled={isRetryButtonEnabled}
      />
    )
  }
}

interface OutterProps {
  group: SubscriptionsGroup
  onMakeRetry: () => Promise<void>
  displayRetry: boolean
}

interface InnerProps extends InjectedIntlProps {
  updatePayment: (args: {
    variables: MutationUpdatePaymentMethodArgs
  }) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
}

type Props = InnerProps & OutterProps

interface State {
  selectedAccountId: string | null
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  isRetryButtonEnabled: boolean
  selectedPaymentSystemId: string | null
  selectedPaymentSystemGroup: PaymentSystemGroup
  showAlert: boolean
}

export default compose<Props, OutterProps>(
  injectIntl,
  withToast,
  graphql(UpdatePaymentMethod, {
    name: 'updatePayment',
  })
)(SubscriptionsGroupPaymentContainer)
