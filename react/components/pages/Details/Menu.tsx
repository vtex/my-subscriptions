import React, { Component, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { ActionMenu } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import ConfirmModal from './ConfirmModal'
import { SubscriptionStatusEnum } from '../../../constants'

class Menu extends Component<Props> {
  state = {
    isModalOpen: false,
    updateType: '',
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  handleOpenModal = (updateType: string) => {
    this.setState({ isModalOpen: true, updateType: updateType })
  }

  handleSelect = (value: string) => {
    if (value === 'skip' || value === 'unskip') {
      this.props.onSkipOrUnskip()
    } else {
      this.handleOpenModal(value)
    }
  }

  handleSuccess = () => {
    this.props.onSuccessUpdate()
    this.setState({ isModalOpen: false })
  }

  handleError = (error: ApolloError) => {
    this.props.onErrorUpdate(error)
    this.setState({ isModalOpen: false })
  }

  render() {
    const { options, subscriptionsGroup, intl } = this.props
    const { isModalOpen, updateType } = this.state

    if (subscriptionsGroup.status === SubscriptionStatusEnum.Canceled) {
      return null
    }

    const actionOptions = options.map(option => {
      return {
        label: intl.formatMessage({
          id: `subscription.manage.${option}`,
        }),
        onClick: () => this.handleSelect(option),
      }
    })

    return (
      <Fragment>
        <ConfirmModal
          isModalOpen={isModalOpen}
          onClose={this.handleCloseModal}
          onSuccessUpdate={this.handleSuccess}
          onErrorUpdate={this.handleError}
          updateType={updateType}
          subscriptionsGroup={subscriptionsGroup}
        />
        <ActionMenu
          label={intl.formatMessage({ id: 'subscription.manage' })}
          buttonProps={{ variation: 'secondary', block: true, size: 'small' }}
          options={actionOptions}
        />
      </Fragment>
    )
  }
}

interface Props extends InjectedIntlProps {
  options: string[]
  subscriptionsGroup: SubscriptionsGroupItemType
  onSuccessUpdate: () => void
  onSkipOrUnskip: () => void
  onErrorUpdate: (error: ApolloError) => void
}

export default injectIntl(Menu)
