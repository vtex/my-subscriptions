import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import type { WrappedComponentProps, MessageDescriptor } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import type { ApolloError } from 'apollo-client'
import { Button } from 'vtex.styleguide'
import type { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import type { Args } from '../graphql/mutations/updateStatus.gql'
import UPDATE_STATUS from '../graphql/mutations/updateStatus.gql'
import ConfirmationModal, {
  messages as modalMessages,
} from './ConfirmationModal'
import { logGraphQLError, getRuntimeInfo } from '../tracking'

export const messages = defineMessages({
  pauseTitle: {
    id: 'subscription.pause.title',
  },
  pauseDescription: {
    id: 'subscription.pause.text',
  },
  cancelTitle: {
    id: 'subscription.cancel.title',
  },
  cancelDescription: {
    id: 'subscription.cancel.text',
  },
  restoreTitle: {
    id: 'subscription.restore.title',
  },
  restoreDescription: {
    id: 'subscription.restore.text',
  },
  cancelationMessage: {
    id: 'subscription.change.status.modal.cancelation',
  },
  confirmationMessage: {
    id: 'subscription.change.status.modal.confirmation',
  },
})

function retrieveMessagesByStatus(status: SubscriptionStatus): {
  titleMessage: MessageDescriptor
  bodyMessage: MessageDescriptor
  cancelationMessage: MessageDescriptor
  confirmationMessage: MessageDescriptor
} {
  let titleMessage: MessageDescriptor
  let bodyMessage: MessageDescriptor

  switch (status) {
    case 'PAUSED':
      titleMessage = messages.pauseTitle
      bodyMessage = messages.pauseDescription
      break

    case 'CANCELED':
      titleMessage = messages.cancelTitle
      bodyMessage = messages.cancelDescription
      break

    default:
      titleMessage = messages.restoreTitle
      bodyMessage = messages.restoreDescription
      break
  }

  return {
    titleMessage,
    bodyMessage,
    cancelationMessage: messages.cancelationMessage,
    confirmationMessage: messages.confirmationMessage,
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
      subscriptionId,
    } = this.props

    const {
      cancelationMessage,
      confirmationMessage,
      titleMessage,
      bodyMessage,
    } = retrieveMessagesByStatus(targetStatus)

    const modalProps = {
      cancelationLabel: intl.formatMessage(cancelationMessage),
      confirmationLabel: intl.formatMessage(confirmationMessage),
      errorMessage: intl.formatMessage(modalMessages.errorMessage),
      isModalOpen: this.state.isModalOpen,
      onCloseModal: this.handleCloseModal,
      successMessage: intl.formatMessage(modalMessages.successMessage),
      onSubmit: () => {
        const variables = {
          subscriptionId,
          status: targetStatus,
        }

        return updateStatus({
          variables,
        }).catch((error: ApolloError) => {
          logGraphQLError({
            error,
            variables,
            runtimeInfo: getRuntimeInfo(),
            type: 'MutationError',
            instance: 'UpdateStatus',
          })
          throw error
        })
      },
    }

    return (
      <Fragment>
        <ConfirmationModal {...modalProps}>
          <h2 className="heading-2">{intl.formatMessage(titleMessage)}</h2>
          <p className="t-body">{intl.formatMessage(bodyMessage)}</p>
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

interface Props {
  subscriptionId: string
  targetStatus: SubscriptionStatus
  block: boolean
}

interface InnerProps extends WrappedComponentProps {
  updateStatus: (args: { variables: Args }) => Promise<unknown>
  showToast: (args: object) => void
}

const enhance = compose<Props & InnerProps, Props>(
  injectIntl,
  graphql(UPDATE_STATUS, { name: 'updateStatus' })
)

export default enhance(SubscriptionUpdateStatusButtonContainer)
