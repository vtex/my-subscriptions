import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Button, IconCaretDown as CaretDown } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import ConfirmModal from './ConfirmModal'
import { SubscriptionStatusEnum } from '../../../constants'

class Menu extends Component<Props> {
  state = {
    isMenuOpen: false,
    isModalOpen: false,
    updateType: '',
  }

  handleClick = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen })
  }

  handleCloseSelect = () => {
    this.setState({ isMenuOpen: false })
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
    const { options, subscriptionsGroup } = this.props
    const { isMenuOpen, isModalOpen, updateType } = this.state

    if (subscriptionsGroup.status === SubscriptionStatusEnum.Canceled) {
      return null
    }

    return (
      <div className="w-100">
        {isModalOpen && (
          <ConfirmModal
            isModalOpen={isModalOpen}
            onClose={this.handleCloseModal}
            onSuccessUpdate={this.handleSuccess}
            onErrorUpdate={this.handleError}
            updateType={updateType}
            subscriptionsGroup={subscriptionsGroup}
          />
        )}
        <div className="relative mt3">
          <Button
            block
            size="small"
            onClick={this.handleClick}
            variation="secondary">
            <div className="flex flex-row justify-center items-center">
              <span>
                {this.props.intl.formatMessage({ id: 'subscription.manage' })}
              </span>
              <div className="ml5">
                <CaretDown color="currentColor" />
              </div>
            </div>
          </Button>
          {isMenuOpen && (
            <div
              style={{ minWidth: '200px' }}
              className="absolute z-999 bg-base right-0 mt4 pv3 b--muted-5 bw1 ba shadow-4">
              {options.map(option => (
                <div
                  key={option}
                  className="pointer nowrap f6 ph5 pv3 hover-bg-muted-5"
                  onClick={() => this.handleSelect(option)}>
                  {this.props.intl.formatMessage({
                    id: `subscription.manage.${option}`,
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
