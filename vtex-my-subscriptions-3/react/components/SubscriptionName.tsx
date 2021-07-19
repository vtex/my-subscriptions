import React, { Component, FocusEvent } from 'react'
import { graphql } from 'react-apollo'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { ApolloError } from 'apollo-client'
import { Input } from 'vtex.styleguide'

import UPDATE_NAME, { Args } from '../graphql/mutations/updateName.gql'
import ConfirmationModal, {
  messages as modalMessages,
} from './ConfirmationModal'
import { logGraphQLError, getRuntimeInfo } from '../tracking'
import EditButton from './EditButton'

const messages = defineMessages({
  title: { id: 'subscription.view.title' },
  choose: {
    id: 'subscription.name.editition.name.title',
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
      intl,
      updateName,
      skus,
      subscriptionId,
      withIconBackground,
      canEdit,
      onSubmit,
      onBlur,
    } = this.props

    let content
    if (skus.length === 1) {
      content = (
        <span className="no-underline c-on-base ttc">
          {getName(intl, name, skus)}
        </span>
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
        if (onSubmit) {
          onSubmit(this.state.name)
          this.handleCloseModal()
        }

        if (!subscriptionId) return

        const variables = {
          name: this.state.name,
          subscriptionId,
        }

        return updateName({
          variables,
        }).catch((error: ApolloError) => {
          logGraphQLError({
            error,
            variables,
            runtimeInfo: getRuntimeInfo(),
            type: 'MutationError',
            instance: 'UpdateName',
          })
          throw error
        })
      },
    }

    return (
      <div className="flex items-center">
        <ConfirmationModal {...modalProps}>
          <div className="t-heading-5 mb4">
            {intl.formatMessage(messages.choose)}
          </div>
          <div className="w-100">
            <Input
              name="name"
              onBlur={onBlur}
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
  subscriptionId?: string
  withIconBackground?: boolean
  onSubmit?: (name: string) => void
  onBlur?: (e: FocusEvent) => void
  canEdit: boolean
  skus: Array<{ name: string }>
}

interface InnerProps extends WrappedComponentProps {
  updateName: (args: { variables: Args }) => Promise<unknown>
  showToast: (args: object) => void
}

interface InputChangeEvent {
  target: { value: string }
}

const enhance = compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  graphql(UPDATE_NAME, { name: 'updateName' })
)

export default enhance(SubscriptionNameContainer)
