import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { IconEdit, Input } from 'vtex.styleguide'

import UPDATE_NAME from '../../graphql/updateName.gql'
import ConfirmationModal from '../commons/ConfirmationModal'

class SubscriptionNameContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
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
      subscriptionGroup: { name, subscriptions },
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
            href={subscriptions[0].sku.detailUrl}>
            {`${subscriptions[0].sku.productName} - ${
              subscriptions[0].sku.name
            }`}
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
        id: 'subscription.name.editition.cancel',
      }),
      confirmationLabel: intl.formatMessage({
        id: 'subscription.name.editition.edit',
      }),
      errorMessage: intl.formatMessage({
        id: 'subscription.fallback.error.message',
      }),
      isModalOpen: this.state.isModalOpen,
      modalContent: (
        <Fragment>
          <h2 className="heading-2">
            {intl.formatMessage({
              id: 'subscription.name.editition.name.title',
            })}
          </h2>
          <div className="flex items-center">
            <div className="w-90">
              <Input
                value={this.state.name}
                onChange={this.handleChangeName}
                disabled={this.state.isLoading}
              />
            </div>
          </div>
        </Fragment>
      ),
      onCloseModal: this.handleCloseModal,
      onLoading: this.handleLoading,
      successMessage: intl.formatMessage({
        id: 'subscription.editition.success',
      }),
      targetPromise: () =>
        updateName({
          variables: {
            name: this.state.name,
            orderGroup: this.props.subscriptionGroup.orderGroup,
          },
        }),
    }

    return (
      <Fragment>
        <ConfirmationModal {...modalProps} />
        <div className="t-heading-4">
          {content}
          <span
            className="ml4 c-action-primary hover-c-emphasis pointer"
            onClick={this.handleOpenModal}>
            <IconEdit />
          </span>
        </div>
      </Fragment>
    )
  }
}

const enhance = compose<any, Props>(
  injectIntl,
  graphql(UPDATE_NAME, { name: 'updateName' })
)

export default enhance(SubscriptionNameContainer)

interface Props {
  subscriptionGroup: SubscriptionsGroupItemType
}

interface InnerProps {
  updateName: (args: object) => Promise<any>
  showToast: (args: object) => void
}

interface InputChangeEvent {
  target: InputChangeEventTarget
}

interface InputChangeEventTarget {
  value: string
}
