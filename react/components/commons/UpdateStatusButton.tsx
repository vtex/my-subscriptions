import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { Button } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import UPDATE_STATUS from '../../graphql/updateStatus.gql'

import ConfirmationModal from './ConfirmationModal'

function retrieveMessagesByStatus(status: SubscriptionStatus) {
  let titleMessageId = ''
  let bodyMessageId = ''

  switch (status) {
    case SubscriptionStatus.Active:
      titleMessageId = 'subscription.restore.title'
      bodyMessageId = 'subscription.restore.text'
      break
    case SubscriptionStatus.Paused:
      titleMessageId = 'subscription.pause.title'
      bodyMessageId = 'subscription.pause.text'
      break
    case SubscriptionStatus.Canceled:
      titleMessageId = 'subscription.cancel.title'
      bodyMessageId = 'subscription.cancel.text'
      break
  }

  return {
    bodyMessageId,
    cancelationMessageId: 'subscription.change.status.modal.cancelation',
    confirmationMessageId: 'subscription.change.status.modal.confirmation',
    titleMessageId,
  }
}
class SubscriptionUpdateStatusButtonContainer extends Component<
  Props & InnerProps
> {
  public state = {
    isModalOpen: false,
  }

  public handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  public handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  public render() {
    const {
      intl,
      children,
      targetStatus,
      block,
      updateStatus,
      subscriptionsGroupId,
    } = this.props

    const messages = retrieveMessagesByStatus(targetStatus)

    const modalProps = {
      cancelationLabel: intl.formatMessage({
        id: messages.cancelationMessageId,
      }),
      confirmationLabel: intl.formatMessage({
        id: messages.confirmationMessageId,
      }),
      errorMessage: intl.formatMessage({
        id: 'subscription.fallback.error.message',
      }),
      isModalOpen: this.state.isModalOpen,

      onCloseModal: this.handleCloseModal,
      successMessage: intl.formatMessage({
        id: 'store/subscription.editition.success',
      }),
      onSubmit: () =>
        updateStatus({
          variables: {
            orderGroup: subscriptionsGroupId,
            status: targetStatus,
          },
        }),
    }

    return (
      <Fragment>
        <ConfirmationModal {...modalProps}>
          <h2 className="heading-2">
            {intl.formatMessage({ id: messages.titleMessageId })}
          </h2>
          <p className="t-body">
            {intl.formatMessage({ id: messages.bodyMessageId })}
          </p>
        </ConfirmationModal>
        <Button
          variation="secondary"
          onClick={this.handleOpenModal}
          block={block}
        >
          {children}
        </Button>
      </Fragment>
    )
  }
}

const enhance = compose<Props & InnerProps, Props>(
  injectIntl,
  graphql(UPDATE_STATUS, { name: 'updateStatus' })
)

interface Props {
  subscriptionsGroupId: string
  targetStatus: SubscriptionStatus
  block: boolean
}

interface InnerProps extends InjectedIntlProps {
  updateStatus: (args: object) => Promise<unknown>
  showToast: (args: object) => void
}

export default enhance(SubscriptionUpdateStatusButtonContainer)
