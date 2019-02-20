import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import {
  Alert,
  Button,
  IconEdit,
  Input,
  Modal,
  withToast,
} from 'vtex.styleguide'

import UPDATE_NAME from '../../graphql/updateName.gql'
import { makeCancelable } from '../../utils'

class SubscriptionNameContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
  public state = {
    isLoading: false,
    isModalOpen: false,
    name: '',
    shouldDisplayError: false,
  }

  private updatePromise: any

  public componentWillUnmount = () => {
    if (this.updatePromise) {
      this.updatePromise.cancel()
    }
  }

  public handleSubmit = () => {
    const { intl, showToast, subscriptionGroup, updateName } = this.props

    this.setState({ isLoading: true })
    this.updatePromise = makeCancelable(
      updateName({
        variables: {
          name: this.state.name,
          orderGroup: subscriptionGroup.orderGroup,
        },
      })
        .then(() => {
          this.setState({ isModalOpen: false })
          showToast({
            message: intl.formatMessage({
              id: 'subscription.editition.success',
            }),
          })
        })
        .catch(() => this.setState({ shouldDisplayError: true }))
        .finally(() => this.setState({ isLoading: false }))
    )
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

  public handleDismissError = () => {
    this.setState({ shouldDisplayError: false })
  }

  public render() {
    const {
      subscriptionGroup: { name, subscriptions },
      intl,
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

    const CustomModal = (
      <Modal
        centered
        isOpen={this.state.isModalOpen}
        onClose={this.handleCloseModal}>
        {this.state.shouldDisplayError && (
          <Alert type="error" onClose={this.handleDismissError}>
            {intl.formatMessage({ id: 'subscription.fallback.error.message' })}
          </Alert>
        )}
        <h2 className="heading-2">
          {intl.formatMessage({ id: 'subscription.name.editition.name.title' })}
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
        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button
              size="small"
              variation="tertiary"
              onClick={this.handleCloseModal}>
              {intl.formatMessage({ id: 'subscription.name.editition.cancel' })}
            </Button>
          </span>
          <Button
            size="small"
            isLoading={this.state.isLoading}
            onClick={this.handleSubmit}>
            {intl.formatMessage({ id: 'subscription.name.editition.edit' })}
          </Button>
        </div>
      </Modal>
    )

    return (
      <Fragment>
        {CustomModal}
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
  withToast,
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
