import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { path } from 'ramda'
import qs from 'query-string'
import { withToast, ShowToastArgs } from 'vtex.styleguide'
import { MutationUpdatePaymentMethodArgs } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import UpdatePaymentMethod from '../../../../graphql/updatePaymentMethod.gql'
import {
  PaymentSystemGroup,
  EditOptions,
  PAYMENT_DIV_ID,
  BASIC_CARD_WRAPPER,
  CSS,
} from '../../../../constants'
import {
  getEditOption,
  scrollToElement,
  removeElementsFromSearch,
} from '../../../../utils'

import EditPayment from './EditPayment'
import PaymentCard from './PaymentCard'

import { SubscriptionsGroup } from '..'

function isEditMode(location: RouteComponentProps['location']) {
  const option = getEditOption(location)

  return option === EditOptions.Payment
}

function newPaymentArgs(location: RouteComponentProps['location']) {
  const args = qs.parse(location.search)

  if (args.newPaymentAccountId && args.newPaymentSystemId) {
    return {
      selectedAccountId: args.newPaymentAccountId,
      selectedPaymentSystemId: args.newPaymentSystemId,
      selectedPaymentSystemGroup: PaymentSystemGroup.CreditCard,
      isEditMode: true,
    }
  }

  return null
}

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
    const hasEdited = this.verifyEdit()

    if (!hasEdited) {
      this.verifyNewPayment()
    }
  }

  public componentWillUnmount = () => {
    this.mounted = false
  }

  private verifyEdit = () => {
    const { location } = this.props
    const shouldOpenEdit = isEditMode(location)

    if (shouldOpenEdit) {
      this.setState({ isEditMode: shouldOpenEdit }, () => {
        scrollToElement(PAYMENT_DIV_ID)

        const search = removeElementsFromSearch(['edit'], location)

        this.props.history.push({
          search,
        })
      })
    }

    return shouldOpenEdit
  }

  private verifyNewPayment = () => {
    const { location, history } = this.props
    const args = newPaymentArgs(location)

    if (args) {
      this.setState({ ...args }, () => {
        scrollToElement(PAYMENT_DIV_ID)

        const search = removeElementsFromSearch(
          ['newPaymentAccountId', 'newPaymentSystemId'],
          location
        )

        history.push({
          search,
        })

        this.handleSave()
      })
    }
  }

  private handleMakeRetry = () => {
    this.props.onMakeRetry().then(() => {
      if (this.mounted) {
        this.setState({
          isRetryButtonEnabled: false,
        })
      }
    })
  }

  private handleEdit = () => {
    this.setState({ isEditMode: true })
  }

  private handleCancel = () => {
    this.setState({ isEditMode: false })
  }

  private handleSave = () => {
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
      .catch((e: any) => {
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

  private handleCloseAlert = () => {
    this.setState({
      showAlert: false,
    })
  }

  private handlePaymentGroupChange = (
    newGroup: PaymentSystemGroup,
    paymentSystemId?: string
  ) =>
    this.setState({
      selectedPaymentSystemGroup: newGroup,
      selectedPaymentSystemId: paymentSystemId || null,
    })

  private handlePaymentChange = (
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

    return (
      <div
        className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}
        id={PAYMENT_DIV_ID}
      >
        {isEditMode ? (
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
        )}
      </div>
    )
  }
}

interface OuterProps {
  group: SubscriptionsGroup
  onMakeRetry: () => Promise<void>
  displayRetry: boolean
}

interface InnerProps extends InjectedIntlProps, RouteComponentProps {
  updatePayment: (args: {
    variables: MutationUpdatePaymentMethodArgs
  }) => Promise<void>
  showToast: ({ message }: ShowToastArgs) => void
}

type Props = InnerProps & OuterProps

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

export default compose<Props, OuterProps>(
  injectIntl,
  withToast,
  withRouter,
  graphql(UpdatePaymentMethod, {
    name: 'updatePayment',
  })
)(SubscriptionsGroupPaymentContainer)
