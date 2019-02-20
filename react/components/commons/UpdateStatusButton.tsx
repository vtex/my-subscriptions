import React, { Component, Fragment, ReactNode } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../enums'
import UPDATE_STATUS from '../../graphql/updateStatus.gql'
import { retrieveMessagesByStatus } from '../../utils'
import ConfirmationModal from '../commons/ConfirmationModal'

class SubscriptionUpdateStatusButtonContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
  public state = {
    isModalOpen: false,
  }

  public handleToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  public render() {
    const {
      intl,
      children,
      targetStatus,
      block,
      updateStatus,
      orderGroup,
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
      modalContent: (
        <Fragment>
          <h2 className="heading-2">
            {intl.formatMessage({ id: messages.titleMessageId })}
          </h2>
          <p className="t-body">
            {intl.formatMessage({ id: messages.bodyMessageId })}
          </p>
        </Fragment>
      ),
      onCloseModal: this.handleToggleModal,
      successMessage: intl.formatMessage({
        id: 'subscription.editition.success',
      }),
      targetPromise: () =>
        updateStatus({
          variables: {
            orderGroup,
            status: targetStatus,
          },
        }),
    }

    return (
      <Fragment>
        <ConfirmationModal {...modalProps} />
        <Button
          variation="secondary"
          onClick={this.handleToggleModal}
          block={block}>
          {children}
        </Button>
      </Fragment>
    )
  }
}

const enhance = compose<any, Props>(
  injectIntl,
  graphql(UPDATE_STATUS, { name: 'updateStatus' })
)

export default enhance(SubscriptionUpdateStatusButtonContainer)

interface Props {
  orderGroup: string
  targetStatus: SubscriptionStatusEnum
  children: ReactNode
  block: boolean
}

interface InnerProps {
  updateStatus: (args: object) => Promise<any>
  showToast: (args: object) => void
}
