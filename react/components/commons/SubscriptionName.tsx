import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import {
  Alert,
  IconEdit,
  Input,
  ModalDialog,
  Spinner,
  withToast,
} from 'vtex.styleguide'

import UPDATE_NAME from '../../graphql/updateName.gql'

class SubscriptionNameContainer extends Component<
  Props & InnerProps & InjectedIntlProps
> {
  public state = {
    isLoading: false,
    isModalOpen: false,
    isMounted: false,
    name: '',
    shouldDisplayError: false,
  }

  public componentDidMount = () => {
    this.setState({ isMounted: true })
  }

  public componentWillUnmount = () => {
    this.setState({ isMounted: false })
  }

  public handleSubmit = () => {
    const { intl, showToast, subscriptionGroup, updateName } = this.props

    this.setState({ isLoading: true })
    updateName({
      variables: {
        name: this.state.name,
        orderGroup: subscriptionGroup.orderGroup,
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

  public handleToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen })
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

    const Modal = (
      <ModalDialog
        centered
        confirmation={{
          label: intl.formatMessage({ id: 'subscription.name.editition.edit' }),
          onClick: this.handleSubmit,
        }}
        cancelation={{
          label: intl.formatMessage({
            id: 'subscription.name.editition.cancel',
          }),
          onClick: this.handleToggleModal,
        }}
        isOpen={this.state.isModalOpen}
        onClose={this.handleToggleModal}>
        {this.state.shouldDisplayError && (
          <Alert type="error" onClose={this.handleDismissError}>
            {intl.formatMessage({ id: 'subscription.fallback.error.message' })}
          </Alert>
        )}
        <h1 className="heading-2">
          {intl.formatMessage({ id: 'subscription.name.editition.name.title' })}
        </h1>
        <div className="flex items-center">
          <div className="w-90">
            <Input
              value={this.state.name}
              onChange={this.handleChangeName}
              disabled={this.state.isLoading}
            />
          </div>
          {this.state.isLoading && (
            <div className="w-10 c-action-primary ml4">
              <Spinner color="currentColor" size={20} />
            </div>
          )}
        </div>
      </ModalDialog>
    )

    return (
      <Fragment>
        {Modal}
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
