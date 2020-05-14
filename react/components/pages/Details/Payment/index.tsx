import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import {
  MutationUpdatePaymentMethodArgs,
  PaymentSystemGroup,
} from 'vtex.subscriptions-graphql'

import UpdatePaymentMethod from '../../../../graphql/updatePaymentMethod.gql'
import EditPayment from './EditPayment'
import PaymentCard from './PaymentCard'

import { SubscriptionsGroup } from '..'

class SubscriptionsGroupPaymentContainer extends Component<Props, State> {
  private mounted: boolean

  constructor(props: Props) {
    super(props)
    this.state = {
      accountId:
        props.group.purchaseSettings.paymentMethod?.paymentAccount?.id ?? null,
      errorMessage: '',
      isEditMode: false,
      isLoading: false,
      isRetryButtonEnabled: true,
      paymentSystemId:
        props.group.purchaseSettings.paymentMethod?.paymentSystemId ?? null,
      paymentSystemGroup:
        props.group.purchaseSettings.paymentMethod?.paymentSystemGroup ??
        'creditCard',
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
    const { paymentSystemGroup, accountId, paymentSystemId } = this.state

    if (!paymentSystemId) return null

    this.setState({ isLoading: true })

    return updatePayment({
      variables: {
        paymentAccountId:
          paymentSystemGroup === 'creditCard' ? accountId : null,
        subscriptionsGroupId: group.id,
        paymentSystemId,
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
          showAlert: true,
        })
      })
  }

  public handleCloseAlert = () => {
    this.setState({
      showAlert: false,
    })
  }

  public handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      paymentSystemId: e.target.value,
      paymentSystemGroup: e.target.name as PaymentSystemGroup,
    })
  }

  public handleCardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ accountId: e.target.value })
  }

  public render() {
    const { group, displayRetry } = this.props
    const {
      isEditMode,
      accountId,
      isLoading,
      paymentSystemGroup,
      showAlert,
      isRetryButtonEnabled,
    } = this.state

    return isEditMode ? (
      <EditPayment
        onSave={this.handleSave}
        onCancel={this.handleCancel}
        onChangePayment={this.handlePaymentChange}
        onChangeCard={this.handleCardChange}
        onCloseAlert={this.handleCloseAlert}
        paymentSystemGroup={paymentSystemGroup}
        showAlert={showAlert}
        errorMessage={this.state.errorMessage}
        accountId={accountId}
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

interface InnerProps extends WrappedComponentProps {
  updatePayment: (args: {
    variables: MutationUpdatePaymentMethodArgs
  }) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
}

type Props = InnerProps & OutterProps

interface State {
  accountId: string | null
  errorMessage: string
  isEditMode: boolean
  isLoading: boolean
  isRetryButtonEnabled: boolean
  paymentSystemId: string | null
  paymentSystemGroup: PaymentSystemGroup
  showAlert: boolean
}

export default compose<Props, OutterProps>(
  injectIntl,
  withToast,
  graphql(UpdatePaymentMethod, {
    name: 'updatePayment',
  })
)(SubscriptionsGroupPaymentContainer)
