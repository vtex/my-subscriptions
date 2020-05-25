import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import {
  InjectedIntlProps,
  injectIntl,
  defineMessages,
  FormattedMessage,
} from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import UPDATE_STATUS from '../graphql/updateStatus.gql'
import ConfirmationModal, {
  messages as modalMessages,
} from './ConfirmationModal'
import { logGraphqlError } from '../tracking'

export const messages = defineMessages({
  pauseTitle: {
    id: 'store/subscription.pause.title',
    defaultMessage: '',
  },
  pauseDescription: {
    id: 'store/subscription.pause.text',
    defaultMessage: '',
  },
  cancelTitle: {
    id: 'store/subscription.cancel.title',
    defaultMessage: '',
  },
  cancelDescription: {
    id: 'store/subscription.cancel.text',
    defaultMessage: '',
  },
  restoreTitle: {
    id: 'store/subscription.restore.title',
    defaultMessage: '',
  },
  restoreDescription: {
    id: 'store/subscription.restore.text',
    defaultMessage: '',
  },
  cancelationMessage: {
    id: 'store/subscription.change.status.modal.cancelation',
    defaultMessage: '',
  },
  confirmationMessage: {
    id: 'store/subscription.change.status.modal.confirmation',
    defaultMessage: '',
  },
})

function retrieveMessagesByStatus(
  status: SubscriptionStatus
): {
  titleMessage: FormattedMessage.MessageDescriptor
  bodyMessage: FormattedMessage.MessageDescriptor
  cancelationMessage: FormattedMessage.MessageDescriptor
  confirmationMessage: FormattedMessage.MessageDescriptor
} {
  let titleMessage: FormattedMessage.MessageDescriptor
  let bodyMessage: FormattedMessage.MessageDescriptor
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
      subscriptionsGroupId,
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
          orderGroup: subscriptionsGroupId,
          status: targetStatus,
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
  subscriptionsGroupId: string
  targetStatus: SubscriptionStatus
  block: boolean
}

interface InnerProps extends InjectedIntlProps, InjectedRuntimeContext {
  updateStatus: (args: object) => Promise<unknown>
  showToast: (args: object) => void
}

const enhance = compose<Props & InnerProps, Props>(
  injectIntl,
  graphql(UPDATE_STATUS, { name: 'updateStatus' }),
  withRuntimeContext
)

export default enhance(SubscriptionUpdateStatusButtonContainer)
