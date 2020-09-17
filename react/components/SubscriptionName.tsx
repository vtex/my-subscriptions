import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import { Input } from 'vtex.styleguide'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import UPDATE_NAME, { Args } from '../graphql/mutations/updateName.gql'
import ConfirmationModal, {
  messages as modalMessages,
} from './ConfirmationModal'
import { logGraphqlError } from '../tracking'
import EditButton from './EditButton'

const messages = defineMessages({
  title: { id: 'store/subscription.view.title', defaultMessage: '' },
  choose: {
    id: 'store/subscription.name.editition.name.title',
    defaultMessage: '',
  },
})

export function getName(
  intl: InnerProps['intl'],
  name: string | null | undefined,
  skus: Array<{ name: string }>
) {
  let content: string
  if (name) {
    content = name
  } else if (skus.length === 1) {
    content = skus[0].name
  } else {
    content = intl.formatMessage(messages.title, { value: skus.length })
  }

  return content
}

class SubscriptionNameContainer extends Component<OuterProps & InnerProps> {
  public state = {
    isLoading: false,
    isModalOpen: false,
    name: '',
  }

  public static defaultProps = {
    withIconBackground: false,
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
    const {
      name,
      status,
      intl,
      updateName,
      skus,
      subscriptionId,
      withIconBackground,
    } = this.props

    let content
    if (skus.length === 1) {
      content = (
        <a
          className="no-underline c-on-base ttc"
          target="_blank"
          rel="noopener noreferrer"
          href={skus[0].detailUrl}
        >
          {getName(intl, name, skus)}
        </a>
      )
    } else {
      content = getName(intl, name, skus)
    }

    const modalProps = {
      cancelationLabel: intl.formatMessage(modalMessages.cancelationLabel),
      confirmationLabel: intl.formatMessage(modalMessages.confirmationLabel),
      errorMessage: intl.formatMessage(modalMessages.errorMessage),
      isModalOpen: this.state.isModalOpen,
      onCloseModal: this.handleCloseModal,
      onLoading: this.handleLoading,
      successMessage: intl.formatMessage(modalMessages.successMessage),
      onSubmit: () => {
        const variables = {
          name: this.state.name,
          subscriptionId,
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
      <div className="flex items-center">
        <ConfirmationModal {...modalProps}>
          <div className="t-heading-5 mb4">
            {intl.formatMessage(messages.choose)}
          </div>
          <div className="w-100">
            <Input
              value={this.state.name}
              onChange={this.handleChangeName}
              disabled={this.state.isLoading}
              maxLength="50"
            />
          </div>
        </ConfirmationModal>
        <span className="mr4">{content}</span>
        {canEdit && (
          <EditButton
            onClick={this.handleOpenModal}
            withBackground={withIconBackground}
          />
        )}
      </div>
    )
  }
}

interface OuterProps {
  name?: string | null
  status: SubscriptionStatus
  subscriptionId: string
  skus: Array<{
    detailUrl: string
    name: string
  }>
  withIconBackground?: boolean
}

interface InnerProps extends WrappedComponentProps, InjectedRuntimeContext {
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
