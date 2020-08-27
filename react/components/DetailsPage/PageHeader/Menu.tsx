import React, { Component } from 'react'
import {
  WrappedComponentProps,
  injectIntl,
  defineMessages,
  MessageDescriptor,
} from 'react-intl'
import { compose } from 'recompose'
import { graphql, MutationResult } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { ActionMenu, withToast, ShowToastArgs } from 'vtex.styleguide'
import { MutationAddItemArgs } from 'vtex.store-graphql'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import ORDER_NOW from '../../../graphql/mutations/orderNow.gql'
import UPDATE_STATUS, {
  Args as UpdateStatusArgs,
} from '../../../graphql/mutations/updateStatus.gql'
import UPDATE_IS_SKIPPED, {
  Args as UpdateIsSkippedArgs,
} from '../../../graphql/mutations/updateIsSkipped.gql'
import { retrieveMenuOptions, MenuOption } from './utils'
import ConfirmationModal, {
  messages as modalMessage,
} from '../../ConfirmationModal'
import { messages as statusMessages } from '../../UpdateStatusButton'
import { logGraphqlError } from '../../../tracking'

const messages = defineMessages({
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
  },
  confirmationMessage: {
    id: 'store/subscription.change.status.modal.confirmation',
    defaultMessage: '',
  },
  cancelationMessage: {
    id: 'store/subscription.change.status.modal.cancelation',
    defaultMessage: '',
  },
  orderAgainConfirmation: {
    id: 'store/subscription.execution.again.confirmation',
    defaultMessage: '',
  },
  orderAgainDescription: {
    id: 'store/subscription.execution.again.description',
    defaultMessage: '',
  },
  skipConfirm: {
    id: 'store/subscription.skip.confirm',
    defaultMessage: '',
  },
  unskipConfirm: {
    id: 'store/subscription.unskip.confirm',
    defaultMessage: '',
  },
  skipTitle: { id: 'store/subscription.skip.title', defaultMessage: '' },
  skipDesc: { id: 'store/subscription.skip.text', defaultMessage: '' },
  unSkipTitle: { id: 'store/subscription.unskip.title', defaultMessage: '' },
  unSkipDesc: { id: 'store/subscription.unskip.text', defaultMessage: '' },
  skipOption: {
    id: 'store/subscription.manage.skip',
    defaultMessage: '',
  },
  unskipOption: {
    id: 'store/subscription.manage.unskip',
    defaultMessage: '',
  },
  cancelOption: {
    id: 'store/subscription.manage.cancel',
    defaultMessage: '',
  },
  pauseOption: {
    id: 'store/subscription.manage.pause',
    defaultMessage: '',
  },
  restoreOption: {
    id: 'store/subscription.manage.restore',
    defaultMessage: '',
  },
  orderNowOption: {
    id: 'store/subscription.manage.orderNow',
    defaultMessage: '',
  },
})

class MenuContainer extends Component<InnerProps & OuterProps, State> {
  public state = {
    isModalOpen: false,
    errorMessage: null,
    updateType: null,
  }

  private handleOpenModal = (updateType: MenuOption) =>
    this.setState({ isModalOpen: true, updateType })

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleError = () =>
    this.setState({
      errorMessage: this.props.intl.formatMessage(messages.errorMessage),
    })

  private handleUpdateSkipped = () => {
    const { updateIsSkipped, isSkipped, subscriptionId, runtime } = this.props

    const variables = {
      subscriptionId,
      isSkipped: !isSkipped,
    }

    return updateIsSkipped({
      variables,
    }).catch((error: ApolloError) => {
      logGraphqlError({
        error,
        variables,
        runtime,
        type: 'MutationError',
        instance: 'UpdateIsSkipped',
      })
      throw error
    })
  }

  private handleOrderNow = () => {
    const { orderFormId, orderNow, skus, runtime } = this.props

    const items = skus.map((sku) => ({
      quantity: sku.quantity,
      id: parseInt(sku.id, 10),
      seller: '1',
    }))

    const variables = {
      orderFormId,
      items,
    }

    return orderNow({ variables })
      .then(() => (window.location.href = '/checkout/'))
      .catch((error: ApolloError) => {
        logGraphqlError({
          error,
          variables,
          runtime,
          type: 'MutationError',
          instance: 'OrderNow',
        })
        throw error
      })
  }

  private handleUpdateStatus(status: SubscriptionStatus) {
    const { updateStatus, subscriptionId } = this.props

    const variables = {
      status,
      subscriptionId,
    }

    return updateStatus({
      variables,
    }).catch((error: ApolloError) => {
      logGraphqlError({
        error,
        variables,
        runtime: this.props.runtime,
        type: 'MutationError',
        instance: 'UpdateStatus',
      })
      throw error
    })
  }

  private retrieveModalConfig = () => {
    const { intl } = this.props
    const { isModalOpen, updateType, errorMessage } = this.state

    let children
    let confirmationLabel = intl.formatMessage(messages.confirmationMessage)
    let onSubmit
    let displaySuccess = true

    const modalBody = ({
      title,
      desc,
    }: {
      title?: MessageDescriptor
      desc: MessageDescriptor
    }) => (
      <>
        {title && (
          <div className="t-heading-4">{intl.formatMessage(title)}</div>
        )}
        <div className="pt6">{intl.formatMessage(desc)}</div>
      </>
    )

    switch ((updateType as unknown) as MenuOption) {
      case 'cancel':
        onSubmit = () => this.handleUpdateStatus('CANCELED')
        children = modalBody({
          title: statusMessages.cancelTitle,
          desc: statusMessages.cancelDescription,
        })
        break
      case 'pause':
        onSubmit = () => this.handleUpdateStatus('PAUSED')
        children = modalBody({
          title: statusMessages.pauseTitle,
          desc: statusMessages.pauseDescription,
        })
        break
      case 'restore':
        onSubmit = () => this.handleUpdateStatus('ACTIVE')
        children = modalBody({
          title: statusMessages.restoreTitle,
          desc: statusMessages.restoreDescription,
        })
        break
      case 'orderNow':
        displaySuccess = false

        onSubmit = this.handleOrderNow
        confirmationLabel = intl.formatMessage(messages.orderAgainConfirmation)
        children = modalBody({ desc: messages.orderAgainDescription })
        break
      default:
        // eslint-disable-next-line no-case-declarations
        const unskip = updateType === 'unskip'
        onSubmit = this.handleUpdateSkipped
        confirmationLabel = intl.formatMessage(
          unskip ? messages.unskipConfirm : messages.skipConfirm
        )

        children = modalBody({
          title: unskip ? messages.unSkipTitle : messages.skipTitle,
          desc: unskip ? messages.unSkipDesc : messages.skipDesc,
        })
        break
    }

    const modalConfigs = {
      onSubmit,
      onCloseModal: this.handleCloseModal,
      onError: this.handleError,
      confirmationLabel,
      children,
      cancelationLabel: intl.formatMessage(modalMessage.cancelationLabel),
      errorMessage,
      successMessage: displaySuccess
        ? intl.formatMessage(modalMessage.successMessage)
        : undefined,
      isModalOpen,
    }

    return modalConfigs
  }

  public render() {
    const { status, intl, orderFormId, isSkipped } = this.props

    if (status === 'CANCELED') {
      return null
    }

    const options = retrieveMenuOptions(isSkipped, status, orderFormId)

    const actionOptions = options.map((option) => {
      return {
        label: intl.formatMessage({
          id: `store/subscription.manage.${option}`,
        }),
        onClick: () => this.handleOpenModal(option),
      }
    })

    const modalProps = this.retrieveModalConfig()

    return (
      <>
        <ConfirmationModal {...modalProps} />
        <ActionMenu
          buttonProps={{ variation: 'tertiary' }}
          options={actionOptions}
        />
      </>
    )
  }
}

interface Variables<T> {
  variables: T
}

interface OuterProps {
  status: SubscriptionStatus
  orderFormId?: string
  isSkipped: boolean
  subscriptionId: string
  skus: Array<{
    id: string
    quantity: number
  }>
}

interface InnerProps extends WrappedComponentProps, InjectedRuntimeContext {
  orderNow: (args: Variables<MutationAddItemArgs>) => Promise<MutationResult>
  updateIsSkipped: (
    args: Variables<UpdateIsSkippedArgs>
  ) => Promise<MutationResult>
  updateStatus: (args: Variables<UpdateStatusArgs>) => Promise<MutationResult>
  showToast: (args: ShowToastArgs) => void
}

type State = {
  isModalOpen: boolean
  errorMessage: string | null
  updateType: MenuOption | null
}

const enhance = compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  withToast,
  withRuntimeContext,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ORDER_NOW, { name: 'orderNow' })
)

export default enhance(MenuContainer)
