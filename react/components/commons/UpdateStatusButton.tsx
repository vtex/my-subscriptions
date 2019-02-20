import React, { Component, Fragment, ReactNode } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { Alert, Button, Modal, withToast } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../enums'
import UPDATE_STATUS from '../../graphql/updateStatus.gql'
import { retrieveMessagesByStatus } from '../../utils'

class SubscriptionUpdateStatusButtonContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
  public state = {
    isLoading: false,
    isModalOpen: false,
    isMounted: false,
    shouldDisplayError: false,
  }

  public componentDidMount = () => {
    this.setState({ isMounted: true })
  }

  public componentWillUnmount = () => {
    this.setState({ isMounted: false })
  }

  public handleSubmit = () => {
    const {
      intl,
      showToast,
      orderGroup,
      updateStatus,
      targetStatus,
    } = this.props

    this.setState({ isLoading: true })
    updateStatus({
      variables: {
        orderGroup,
        status: targetStatus,
      },
    })
      .then(() => {
        if (this.state.isMounted) {
          this.setState({ isModalOpen: false })
          showToast({
            message: intl.formatMessage({
              id: 'subscription.editition.success',
            }),
          })
        }
      })
      .catch(() => {
        if (this.state.isMounted) {
          this.setState({ shouldDisplayError: true })
        }
      })
      .finally(() => {
        if (this.state.isMounted) {
          this.setState({ isLoading: false })
        }
      })
  }

  public handleToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  public handleDismissError = () => {
    this.setState({ shouldDisplayError: false })
  }

  public render() {
    const { intl, children, targetStatus, block } = this.props

    const messages = retrieveMessagesByStatus(targetStatus)

    const CustomModal = (
      <Modal
        centered
        isOpen={this.state.isModalOpen}
        onClose={this.handleToggleModal}>
        {this.state.shouldDisplayError && (
          <Alert type="error" onClose={this.handleDismissError}>
            {intl.formatMessage({ id: 'subscription.fallback.error.message' })}
          </Alert>
        )}
        <h2 className="heading-2">
          {intl.formatMessage({ id: messages.titleMessageId })}
        </h2>
        <p className="t-body">
          {intl.formatMessage({ id: messages.bodyMessageId })}
        </p>
        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button
              size="small"
              variation="tertiary"
              onClick={this.handleToggleModal}>
              {intl.formatMessage({ id: messages.cancelationMessageId })}
            </Button>
          </span>
          <Button
            size="small"
            isLoading={this.state.isLoading}
            onClick={this.handleSubmit}>
            {intl.formatMessage({ id: messages.confirmationMessageId })}
          </Button>
        </div>
      </Modal>
    )

    return (
      <Fragment>
        {CustomModal}
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
  withToast,
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
