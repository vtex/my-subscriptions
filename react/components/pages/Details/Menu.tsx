import React, { Component, Fragment } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  defineMessages,
  FormattedMessage,
} from 'react-intl'
import { compose, branch, renderNothing } from 'recompose'
import { graphql, MutationResult, DataValue } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'
import { ActionMenu, withToast, ShowToastArgs } from 'vtex.styleguide'
import { MutationAddItemArgs } from 'vtex.store-graphql'
import {
  MutationUpdateIsSkippedArgs,
  MutationUpdateStatusArgs,
  SubscriptionStatus as Status,
} from 'vtex.subscriptions-graphql'

import ADD_TO_CART from '../../../graphql/addToCart.gql'
import ORDER_FORM_ID from '../../../graphql/orderFormId.gql'
import UPDATE_STATUS from '../../../graphql/updateStatus.gql'
import UPDATE_IS_SKIPPED from '../../../graphql/updateIsSkipped.gql'
import { SubscriptionStatus, MenuOptionsEnum } from '../../../constants'
import { retrieveMenuOptions, logOrderNowMetric } from '../../../utils'
import ConfirmationModal, {
  messages as modalMessage,
} from '../../commons/ConfirmationModal'
import { messages as statusMessages } from '../../UpdateStatusButton'
import { SubscriptionsGroup } from '.'
import { logGraphqlError, queryWrapper } from '../../../tracking'

const INSTANCE = 'SubscriptionsDetails/OrderForm'

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
    id: 'store/subscription.order.again.confirmation',
    defaultMessage: '',
  },
  orderAgainDescription: {
    id: 'store/subscription.order.again.description',
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
  manage: { id: 'store/subscription.manage', defaultMessage: '' },
})

class MenuContainer extends Component<InnerProps & OutterProps> {
  public state = {
    isModalOpen: false,
    errorMessage: '',
    updateType: '',
  }

  private handleOpenModal = (updateType: MenuOptionsEnum) => {
    this.setState({ isModalOpen: true, updateType })
  }

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleError = () =>
    this.setState({
      errorMessage: this.props.intl.formatMessage(messages.errorMessage),
    })

  private handleUpdateSkipped = () => {
    const {
      updateIsSkipped,
      group: { id, isSkipped },
    } = this.props

    const variables = {
      subscriptionsGroupId: id,
      isSkipped: !isSkipped,
    }

    return updateIsSkipped({
      variables,
    }).catch((error: ApolloError) => {
      logGraphqlError({
        error,
        variables,
        runtime: this.props.runtime,
        type: 'MutationError',
        instance: 'UpdateIsSkipped',
      })
      throw error
    })
  }

  private handleOrderNow = () => {
    const { orderFormId, addToCart, group, runtime } = this.props

    const items = group.subscriptions.map((subscription) => ({
      quantity: subscription.quantity,
      id: parseInt(subscription.sku.id, 10),
      seller: '1',
    }))

    const variables = {
      orderFormId,
      items,
    }

    return addToCart({ variables })
      .then(() => {
        logOrderNowMetric(runtime, group.id)
        window.location.href = '/checkout/'
      })
      .catch((error: ApolloError) => {
        logGraphqlError({
          error,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'OrderNow',
        })
        throw error
      })
  }

  private handleUpdateStatus(status: SubscriptionStatus) {
    const {
      updateStatus,
      group: { id },
    } = this.props

    const variables = {
      status: (status as unknown) as Status, // since enums from the graphql can't be used.
      subscriptionsGroupId: id,
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
      title?: FormattedMessage.MessageDescriptor
      desc: FormattedMessage.MessageDescriptor
    }) => (
      <Fragment>
        {title && (
          <span className="db b f5">
            {this.props.intl.formatMessage(title)}
          </span>
        )}
        <span className="db pt6">{this.props.intl.formatMessage(desc)}</span>
      </Fragment>
    )

    switch (updateType) {
      case MenuOptionsEnum.Cancel:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Canceled)
        children = modalBody({
          title: statusMessages.cancelTitle,
          desc: statusMessages.cancelDescription,
        })
        break
      case MenuOptionsEnum.Pause:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Paused)
        children = modalBody({
          title: statusMessages.pauseTitle,
          desc: statusMessages.pauseDescription,
        })
        break
      case MenuOptionsEnum.Restore:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Active)
        children = modalBody({
          title: statusMessages.restoreTitle,
          desc: statusMessages.restoreDescription,
        })
        break
      case MenuOptionsEnum.OrderNow:
        displaySuccess = false

        onSubmit = this.handleOrderNow
        confirmationLabel = intl.formatMessage(messages.orderAgainConfirmation)
        children = modalBody({ desc: messages.orderAgainDescription })
        break
      default:
        // eslint-disable-next-line no-case-declarations
        const unskip = updateType === MenuOptionsEnum.Unskip
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
    const { group, intl, orderFormId } = this.props

    if (group.status === SubscriptionStatus.Canceled) {
      return null
    }

    const options = retrieveMenuOptions(
      group.isSkipped,
      group.status,
      orderFormId
    )

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
      <Fragment>
        <ConfirmationModal {...modalProps} />
        <ActionMenu
          label={intl.formatMessage(messages.manage)}
          buttonProps={{ variation: 'secondary', block: true, size: 'small' }}
          options={actionOptions}
        />
      </Fragment>
    )
  }
}

interface Variables<T> {
  variables: T
}

interface OutterProps {
  group: SubscriptionsGroup
}

interface InnerProps
  extends InjectedIntlProps,
    InjectedRuntimeContext,
    ChildProps {
  addToCart: (args: Variables<MutationAddItemArgs>) => Promise<MutationResult>
  updateIsSkipped: (
    args: Variables<MutationUpdateIsSkippedArgs>
  ) => Promise<MutationResult>
  updateStatus: (
    args: Variables<MutationUpdateStatusArgs>
  ) => Promise<MutationResult>
  showToast: (args: ShowToastArgs) => void
}

interface Response {
  orderForm: {
    orderFormId: string
  }
}

interface ChildProps {
  loading: boolean
  orderFormId: string | undefined
  data: DataValue<Response, {}>
}

const enhance = compose<InnerProps & OutterProps, OutterProps>(
  injectIntl,
  withToast,
  withRuntimeContext,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ADD_TO_CART, { name: 'addToCart' }),
  queryWrapper<{}, Response, {}, ChildProps>(INSTANCE, ORDER_FORM_ID, {
    props: ({ data }) => ({
      orderFormId: data?.orderForm?.orderFormId,
      loading: data?.loading ?? true,
      data: data as DataValue<Response, {}>,
    }),
  }),
  branch(({ loading }: InnerProps) => loading, renderNothing)
)

export default enhance(MenuContainer)
