import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import { IconEdit, Input } from 'vtex.styleguide'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import UPDATE_NAME, { Args } from '../graphql/mutations/updateName.gql'
import ConfirmationModal, {
  messages as modalMessages,
} from './ConfirmationModal'
import { logGraphqlError } from '../tracking'

const messages = defineMessages({
  title: { id: 'store/subscription.view.title', defaultMessage: '' },
  choose: {
    id: 'store/subscription.name.editition.name.title',
    defaultMessage: '',
  },
  confirmationLabel: {
    id: 'store/subscription.name.editition.edit',
    defaultMessage: '',
  },
})

class SubscriptionNameContainer extends Component<OuterProps & InnerProps> {
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
      name: this.props.name,
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
    const { name, status, intl, updateName, skus, subscriptionId } = this.props

    let content
    if (name) {
      content = name
    } else if (skus.length === 1) {
      content = (
        <a
          className="no-underline c-on-base ttc"
          target="_blank"
          rel="noopener noreferrer"
          href={skus[0].detailUrl}
        >
          {`${skus[0].productName} - ${skus[0].name}`}
        </a>
      )
    } else {
      content = intl.formatMessage(messages.title, { value: skus.length })
    }

    const modalProps = {
      cancelationLabel: intl.formatMessage(modalMessages.cancelationLabel),
      confirmationLabel: intl.formatMessage(messages.confirmationLabel),
      errorMessage: intl.formatMessage(modalMessages.errorMessage),
      isModalOpen: this.state.isModalOpen,
      onCloseModal: this.handleCloseModal,
      onLoading: this.handleLoading,
      successMessage: intl.formatMessage(modalMessages.successMessage),
      onSubmit: () => {
        const variables = {
          name: this.state.name,
          id: subscriptionId,
        }
        return updateName({
          variables,
        }).catch((error: ApolloError) => {
          logGraphqlError({
            error,
            variables,
            runtime: this.props.runtime,
            type: 'MutationError',
            instance: 'UpdateName',
          })
          throw error
        })
      },
    }

    const canEdit = status === 'ACTIVE'

    return (
      <Fragment>
        <ConfirmationModal {...modalProps}>
          <h2 className="t-heading-5 c-on-base mt0 mb7">
            {intl.formatMessage(messages.choose)}
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
            <button
              className="ml5 c-action-primary hover-c-action-primary pointer bn bg-transparent"
              onClick={this.handleOpenModal}
            >
              <IconEdit solid />
            </button>
          )}
        </div>
      </Fragment>
    )
  }
}

interface OuterProps {
  name?: string | null
  status: SubscriptionStatus
  subscriptionId: string
  skus: Array<{
    detailUrl: string
    productName: string
    name: string
  }>
}

interface InnerProps extends InjectedIntlProps, InjectedRuntimeContext {
  updateName: (args: { variables: Args }) => Promise<unknown>
  showToast: (args: object) => void
}

interface InputChangeEvent {
  target: { value: string }
}

const enhance = compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  graphql(UPDATE_NAME, { name: 'updateName' }),
  withRuntimeContext
)

export default enhance(SubscriptionNameContainer)
