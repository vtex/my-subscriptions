import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { Button, Modal } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import UpdateStatus from '../../../graphql/updateStatus.gql'
import { SubscriptionStatusEnum } from '../../../enums'

class ConfirmModal extends Component<InnerProps & OutterProps> {
  state = {
    isLoading: false,
  }

  updateStatus(status: SubscriptionStatusEnum) {
    this.props
      .updateStatus({
        variables: {
          status: status,
          orderGroup: this.props.subscriptionsGroup.orderGroup,
        },
      })
      .then(() => {
        this.setState({ isLoading: false })
        this.props.onSuccessUpdate()
      })
      .catch((error: ApolloError) => {
        this.setState({ isLoading: false })
        this.props.onErrorUpdate(error)
      })
  }

  handleUpdateStatus = () => {
    const { updateType } = this.props
    this.setState({ isLoading: true })
    updateType === 'restore'
      ? this.updateStatus(SubscriptionStatusEnum.ACTIVE)
      : updateType === 'cancel'
      ? this.updateStatus(SubscriptionStatusEnum.CANCELED)
      : this.updateStatus(SubscriptionStatusEnum.PAUSED)
  }

  render() {
    const { onClose, isModalOpen, updateType } = this.props
    return (
      <Modal centered isOpen={isModalOpen} onClose={onClose}>
        <span className="db b f5">
          {this.props.intl.formatMessage({
            id:
              updateType === 'restore'
                ? 'subscription.restore.title'
                : updateType === 'cancel'
                ? 'subscription.cancel.title'
                : 'subscription.pause.title',
          })}
        </span>
        <span className="db pt6">
          {this.props.intl.formatMessage({
            id:
              updateType === 'restore'
                ? 'subscription.restore.text'
                : updateType === 'cancel'
                ? 'subscription.cancel.text'
                : 'subscription.pause.text',
          })}
        </span>

        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button size="small" variation="tertiary" onClick={onClose}>
              {this.props.intl.formatMessage({ id: 'commons.no' })}
            </Button>
          </span>
          <Button
            size="small"
            variation="primary"
            isLoading={this.state.isLoading}
            onClick={this.handleUpdateStatus}>
            {this.props.intl.formatMessage({ id: 'commons.yes' })}
          </Button>
        </div>
      </Modal>
    )
  }
}

interface OutterProps {
  onClose: () => void
  onSuccessUpdate: () => void
  onErrorUpdate: (error: ApolloError) => void
  isModalOpen: boolean
  subscriptionsGroup: SubscriptionsGroupItemType
  updateType: string
}

interface InnerProps extends InjectedIntlProps {
  updateStatus: (args: Variables<UpdateStatusArgs>) => Promise<void>
}

const updateStatusMutation = {
  name: 'updateStatus',
  options({
    subscriptionsGroup,
    status,
  }: {
    subscriptionsGroup: SubscriptionsGroupItemType
    status: SubscriptionStatusEnum
  }) {
    return {
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
        status: status,
      },
    }
  },
}

export default compose<InnerProps & OutterProps, OutterProps>(
  injectIntl,
  graphql(UpdateStatus, updateStatusMutation)
)(ConfirmModal)
