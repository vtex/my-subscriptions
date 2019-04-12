import React, { Component, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose, renderNothing, branch } from 'recompose'
import { ActionMenu, withToast } from 'vtex.styleguide'
import { graphql } from 'react-apollo'
import { ApolloError } from 'apollo-client'

import ADD_TO_CART from '../../../graphql/addToCart.gql'
import ORDER_FORM_ID from '../../../graphql/orderFormId.gql'
import UPDATE_STATUS from '../../../graphql/updateStatus.gql'
import UPDATE_IS_SKIPPED from '../../../graphql/updateIsSkipped.gql'
import { SubscriptionStatusEnum, MenuOptionsEnum } from '../../../constants'
import { retrieveMenuOptions } from '../../../utils'
import ConfirmationModal from '../../commons/ConfirmationModal'

class MenuContainer extends Component<InnerProps & OutterProps> {
  state = {
    isModalOpen: false,
    errorMessage: '',
    updateType: '',
  }

  handleOpenModal = (updateType: MenuOptionsEnum) => {
    this.setState({ isModalOpen: true, updateType })
  }

  handleCloseModal = () => this.setState({ isModalOpen: false })

  handleError = (error: ApolloError) => {
    this.setState({
      errorMessage: `subscription.fetch.${error.graphQLErrors.length > 0 &&
        error.graphQLErrors[0].extensions &&
        error.graphQLErrors[0].extensions.error &&
        error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleUpdateSkipped = () => {
    const {
      updateIsSkipped,
      subscriptionsGroup: { orderGroup, isSkipped },
    } = this.props

    return updateIsSkipped({
      variables: {
        orderGroup,
        isSkipped: !isSkipped,
      },
    })
  }

  handleOrderNow = () => {
    const { orderFormId, addToCart, subscriptionsGroup } = this.props

    const items = subscriptionsGroup.subscriptions.map(subscription => ({
      quantity: subscription.quantity,
      id: parseInt(subscription.sku.SkuId, 10),
      seller: '1',
      index: 1,
    }))

    const variables = {
      orderFormId,
      items,
    }

    return addToCart({ variables }).then(() => {
      window.location.href = '/checkout/'
    })
  }

  handleUpdateStatus(status: SubscriptionStatusEnum) {
    const {
      updateStatus,
      subscriptionsGroup: { orderGroup },
    } = this.props

    return updateStatus({ variables: { status, orderGroup } })
  }

  retrieveModalConfig = () => {
    const { intl } = this.props
    const { isModalOpen, updateType, errorMessage } = this.state

    let children
    let confirmationLabel
    let onSubmit
    let displaySuccess = true

    const modalBody = ({
      titleId,
      descId,
    }: {
      titleId?: string
      descId: string
    }) => (
      <Fragment>
        {titleId && (
          <span className="db b f5">
            {this.props.intl.formatMessage({
              id: titleId,
            })}
          </span>
        )}
        <span className="db pt6">
          {this.props.intl.formatMessage({
            id: descId,
          })}
        </span>
      </Fragment>
    )

    switch (updateType) {
      case MenuOptionsEnum.Cancel:
        onSubmit = () =>
          this.handleUpdateStatus(SubscriptionStatusEnum.Canceled)
        confirmationLabel = this.props.intl.formatMessage({ id: 'commons.yes' })
        children = modalBody({
          titleId: 'subscription.cancel.title',
          descId: 'subscription.cancel.text',
        })
        break
      case MenuOptionsEnum.Pause:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatusEnum.Paused)
        confirmationLabel = this.props.intl.formatMessage({ id: 'commons.yes' })
        children = modalBody({
          titleId: 'subscription.pause.title',
          descId: 'subscription.pause.text',
        })
        break
      case MenuOptionsEnum.Restore:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatusEnum.Active)
        confirmationLabel = this.props.intl.formatMessage({ id: 'commons.yes' })
        children = modalBody({
          titleId: 'subscription.restore.title',
          descId: 'subscription.restore.text',
        })
        break
      case MenuOptionsEnum.OrderNow:
        displaySuccess = false

        onSubmit = this.handleOrderNow
        confirmationLabel = intl.formatMessage({
          id: 'subscription.order.again.confirmation',
        })
        children = modalBody({ descId: 'subscription.order.again.description' })
        break
      default:
        const unskip = updateType === MenuOptionsEnum.Unskip
        onSubmit = this.handleUpdateSkipped
        confirmationLabel = intl.formatMessage({
          id: unskip
            ? 'subscription.unskip.confirm'
            : 'subscription.skip.confirm',
        })

        const titleId = unskip
          ? 'subscription.unskip.title'
          : 'subscription.skip.title'
        const descId = unskip
          ? 'subscription.unskip.text'
          : 'subscription.skip.text'

        children = modalBody({ titleId, descId })
        break
    }

    const modalConfigs = {
      onSubmit,
      onCloseModal: this.handleCloseModal,
      onError: this.handleError,
      confirmationLabel,
      children,
      cancelationLabel: intl.formatMessage({
        id: 'subscription.editition.cancel',
      }),
      errorMessage,
      successMessage: displaySuccess
        ? intl.formatMessage({ id: 'subscription.edit.success' })
        : undefined,
      isModalOpen,
    }

    return modalConfigs
  }

  render() {
    const { subscriptionsGroup, intl } = this.props

    if (subscriptionsGroup.status === SubscriptionStatusEnum.Canceled) {
      return null
    }

    const options = retrieveMenuOptions(
      subscriptionsGroup.isSkipped,
      subscriptionsGroup.status
    )

    const actionOptions = options.map(option => {
      return {
        label: intl.formatMessage({
          id: `subscription.manage.${option}`,
        }),
        onClick: () => this.handleOpenModal(option),
      }
    })

    const modalProps = this.retrieveModalConfig()

    return (
      <Fragment>
        <ConfirmationModal {...modalProps} />
        <ActionMenu
          label={intl.formatMessage({ id: 'subscription.manage' })}
          buttonProps={{ variation: 'secondary', block: true, size: 'small' }}
          options={actionOptions}
        />
      </Fragment>
    )
  }
}

interface OutterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
}

interface InnerProps extends InjectedIntlProps {
  addToCart: (args: Variables<AddToCarArgs>) => Promise<void>
  updateIsSkipped: (args: Variables<UpdateIsSkippedArgs>) => Promise<void>
  updateStatus: (args: Variables<UpdateStatusArgs>) => Promise<void>
  showToast: (args: ShowToastArgs) => void
  orderFormId: string
}

const enhance = compose<InnerProps & OutterProps, OutterProps>(
  injectIntl,
  withToast,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ADD_TO_CART, { name: 'addToCart' }),
  graphql(ORDER_FORM_ID, {
    props: ({ data }: any) => ({
      orderFormId: data && data.orderForm && data.orderForm.orderFormId,
    }),
  }),
  branch(({ orderFormId }: InnerProps) => !orderFormId, renderNothing)
)

export default enhance(MenuContainer)
