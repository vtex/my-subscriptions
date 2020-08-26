import React, { Component } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
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
import { SubscriptionAction, retrieveModalConfig } from '../utils'
import { logGraphqlError } from '../../../tracking'
import ConfirmationModal from '../../ConfirmationModal'

const messages = defineMessages({
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
  },
  cancelationMessage: {
    id: 'store/subscription.change.status.modal.cancelation',
  },
  skipOption: {
    id: 'store/subscription.manage.skip',
  },
  unskipOption: {
    id: 'store/subscription.manage.unskip',
  },
  cancelOption: {
    id: 'store/subscription.manage.cancel',
  },
  pauseOption: {
    id: 'store/subscription.manage.pause',
  },
  restoreOption: {
    id: 'store/subscription.manage.restore',
  },
  orderNowOption: {
    id: 'store/subscription.manage.orderNow',
  },
})

function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus,
  orderFormId: string | undefined
): SubscriptionAction[] {
  const options: SubscriptionAction[] = isSkipped
    ? ['unskip', 'pause', 'cancel']
    : status === 'PAUSED'
    ? ['restore', 'cancel']
    : ['skip', 'pause', 'cancel']

  if (orderFormId) {
    options.push('orderNow')
  }

  return options
}

class MenuContainer extends Component<InnerProps & OuterProps, State> {
  public state = {
    isModalOpen: false,
    errorMessage: null,
    updateType: null,
  }

  private handleOpenModal = (updateType: SubscriptionAction) =>
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

  public render() {
    const { status, intl, orderFormId, isSkipped } = this.props
    const { updateType, isModalOpen, errorMessage } = this.state

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

    const modalProps = retrieveModalConfig({
      orderNow: this.handleOrderNow,
      onCloseModal: this.handleCloseModal,
      onError: this.handleError,
      updateSkip: this.handleUpdateSkipped,
      updateStatus: this.handleUpdateStatus,
      intl,
      action: updateType,
      isModalOpen,
      errorMessage,
    })

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
  updateType: SubscriptionAction | null
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
