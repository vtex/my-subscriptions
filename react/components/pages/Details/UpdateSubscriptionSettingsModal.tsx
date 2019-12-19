import React, { Component, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose, renderNothing, branch } from 'recompose'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { MutationAddItemArgs } from 'vtex.store-graphql'
import {
  MutationUpdateIsSkippedArgs,
  MutationUpdateStatusArgs,
  SubscriptionStatus,
} from 'vtex.subscriptions-graphql'

import ADD_TO_CART from '../../../graphql/addToCart.gql'
import ORDER_FORM_ID from '../../../graphql/orderFormId.gql'
import UPDATE_STATUS from '../../../graphql/updateStatus.gql'
import UPDATE_IS_SKIPPED from '../../../graphql/updateIsSkipped.gql'
import { UpdateAction } from '../../../constants'
import { logOrderNowMetric } from '../../../utils'
import ConfirmationModal from '../../commons/ConfirmationModal'

import { SubscriptionsGroup } from '.'

class UpdateSubscriptionSettingsModal extends Component<Props> {
  private handleUpdateSkipped = () => {
    const {
      updateIsSkipped,
      group: { id, isSkipped },
    } = this.props

    return updateIsSkipped({
      variables: {
        subscriptionsGroupId: id,
        isSkipped: !isSkipped,
      },
    })
  }

  private handleOrderNow = () => {
    const { orderFormId, addToCart, group, runtime } = this.props

    const items = group.subscriptions.map(subscription => ({
      quantity: subscription.quantity,
      id: parseInt(subscription.sku.id, 10),
      seller: '1',
    }))

    const variables = {
      orderFormId,
      items,
    }

    return addToCart({ variables }).then(() => {
      logOrderNowMetric(runtime.account, group.id)
      window.location.href = '/checkout/'
    })
  }

  private handleUpdateStatus(status: SubscriptionStatus) {
    const {
      updateStatus,
      group: { id },
    } = this.props

    return updateStatus({
      variables: {
        status,
        subscriptionsGroupId: id,
      },
    })
  }

  private modalBody = ({
    titleId,
    descId,
  }: {
    titleId?: string
    descId: string
  }) => (
    <Fragment>
      {titleId && (
        <div className="b f5">
          {this.props.intl.formatMessage({
            id: titleId,
          })}
        </div>
      )}
      <div className="mt6">
        {this.props.intl.formatMessage({
          id: descId,
        })}
      </div>
    </Fragment>
  )

  private retrieveModalConfig = () => {
    const { intl, updateAction, onCloseModal } = this.props

    let children
    let confirmationLabel
    let onSubmit
    let displaySuccess = true
    const unskip = updateAction === UpdateAction.Unskip

    switch (updateAction) {
      case UpdateAction.Cancel:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Canceled)
        confirmationLabel = intl.formatMessage({ id: 'commons.yes' })
        children = this.modalBody({
          titleId: 'subscription.cancel.title',
          descId: 'subscription.cancel.text',
        })
        break
      case UpdateAction.Pause:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Paused)
        confirmationLabel = intl.formatMessage({ id: 'commons.yes' })
        children = this.modalBody({
          titleId: 'subscription.pause.title',
          descId: 'subscription.pause.text',
        })
        break
      case UpdateAction.Restore:
        onSubmit = () => this.handleUpdateStatus(SubscriptionStatus.Active)
        confirmationLabel = intl.formatMessage({ id: 'commons.yes' })
        children = this.modalBody({
          titleId: 'subscription.restore.title',
          descId: 'subscription.restore.text',
        })
        break
      case UpdateAction.OrderNow:
        displaySuccess = false

        onSubmit = this.handleOrderNow
        confirmationLabel = intl.formatMessage({
          id: 'subscription.order.again.confirmation',
        })
        children = this.modalBody({
          descId: 'subscription.order.again.description',
        })
        break
      default:
        onSubmit = this.handleUpdateSkipped
        confirmationLabel = intl.formatMessage({
          id: unskip
            ? 'subscription.unskip.confirm'
            : 'subscription.skip.confirm',
        })
        children = this.modalBody({
          titleId: unskip
            ? 'subscription.unskip.title'
            : 'subscription.skip.title',
          descId: unskip
            ? 'subscription.unskip.text'
            : 'subscription.skip.text',
        })
        break
    }

    const modalConfigs = {
      onSubmit,
      onCloseModal,
      confirmationLabel,
      children,
      cancelationLabel: intl.formatMessage({
        id: 'subscription.editition.cancel',
      }),
      errorMessage: 'subscription.fallback.error.message',
      successMessage: displaySuccess
        ? intl.formatMessage({ id: 'subscription.edit.success' })
        : undefined,
      isModalOpen: updateAction,
    }

    return modalConfigs
  }

  public render() {
    const modalProps = this.retrieveModalConfig()

    return <ConfirmationModal {...modalProps} />
  }
}

interface Variables<T> {
  variables: T
}

interface Response {
  orderForm: {
    orderFormId: string
  }
}

interface OuterProps {
  updateAction: UpdateAction | null
  group: SubscriptionsGroup
  onCloseModal: () => void
}

interface InnerProps extends InjectedIntlProps {
  addToCart: (args: Variables<MutationAddItemArgs>) => Promise<void>
  updateIsSkipped: (
    args: Variables<MutationUpdateIsSkippedArgs>
  ) => Promise<void>
  updateStatus: (args: Variables<MutationUpdateStatusArgs>) => Promise<void>
  orderFormId: string
  runtime: {
    account: string
  }
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withRuntimeContext,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  graphql(UPDATE_IS_SKIPPED, { name: 'updateIsSkipped' }),
  graphql(ADD_TO_CART, { name: 'addToCart' }),
  graphql<{}, Response, {}, { orderFormId?: string }>(ORDER_FORM_ID, {
    props: ({ data }) => ({
      orderFormId: data?.orderForm?.orderFormId,
    }),
  }),
  branch(({ orderFormId }: InnerProps) => !orderFormId, renderNothing)
)

export default enhance(UpdateSubscriptionSettingsModal)
