import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { IconEdit, Input } from 'vtex.styleguide'

import UPDATE_NAME from '../../graphql/updateName.gql'
import ConfirmationModal from '../commons/ConfirmationModal'
import { SubscriptionStatusEnum } from '../../constants'

class SubscriptionNameContainer extends Component<OutterProps & InnerProps> {
  public state = {
    isLoading: false,
    isModalOpen: false,
    name: '',
  }

  public handleLoading = (value: boolean) => {
    this.setState({ isLoading: value })
  }

  public handleOpenModal = () => {
    this.setState({
      isModalOpen: true,
      name: this.props.subscriptionGroup.name,
    })
  }

  public handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
    })
  }

  public handleChangeName = (event: InputChangeEvent) => {
    this.setState({ name: event.target.value })
  }

  public render() {
    const {
      subscriptionGroup: { name, subscriptions, status },
      intl,
      updateName,
    } = this.props

    let content
    if (name) {
      content = name
    } else {
      if (subscriptions.length === 1) {
        content = (
          <a
            className="no-underline c-on-base ttc"
            target="_blank"
            href={subscriptions[0].sku.detailUrl}
          >
            {`${subscriptions[0].sku.productName} - ${subscriptions[0].sku.name}`}
          </a>
        )
      } else {
        content = intl.formatMessage(
          { id: 'subscription.view.title' },
          { value: subscriptions.length }
        )
      }
    }

    const modalProps = {
      cancelationLabel: intl.formatMessage({
        id: 'subscription.editition.cancel',
      }),
      confirmationLabel: intl.formatMessage({
        id: 'subscription.name.editition.edit',
      }),
      errorMessage: intl.formatMessage({
        id: 'subscription.fallback.error.message',
      }),
      isModalOpen: this.state.isModalOpen,
      onCloseModal: this.handleCloseModal,
      onLoading: this.handleLoading,
      successMessage: intl.formatMessage({
        id: 'subscription.editition.success',
      }),
      onSubmit: () =>
        updateName({
          variables: {
            name: this.state.name,
            orderGroup: this.props.subscriptionGroup.orderGroup,
          },
        }),
    }

    const canEdit = status === SubscriptionStatusEnum.Active

    return (
      <Fragment>
        <ConfirmationModal {...modalProps}>
          <h2 className="t-heading-5 c-on-base mt0 mb7">
            {intl.formatMessage({
              id: 'subscription.name.editition.name.title',
            })}
          </h2>
          <div className="w-100">
            <Input
              value={this.state.name}
              onChange={this.handleChangeName}
              disabled={this.state.isLoading}
            />
          </div>
        </ConfirmationModal>
        <div className="t-heading-5 c-on-base">
          {content}
          {canEdit && (
            <span
              className="ml5 c-action-primary hover-c-action-primary pointer"
              onClick={this.handleOpenModal}
            >
              <IconEdit solid />
            </span>
          )}
        </div>
      </Fragment>
    )
  }
}

const enhance = compose<InnerProps & OutterProps, OutterProps>(
  injectIntl,
  graphql(UPDATE_NAME, { name: 'updateName' })
)

export default enhance(SubscriptionNameContainer)

interface OutterProps {
  subscriptionGroup: SubscriptionsGroupItemType
}

interface InnerProps extends InjectedIntlProps {
  updateName: (args: object) => Promise<any>
  showToast: (args: object) => void
}

interface InputChangeEvent {
  target: { value: string }
}
