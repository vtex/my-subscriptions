import React, { Component } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { compose } from 'recompose'
import { ButtonWithIcon, IconPlus } from 'vtex.styleguide'

import Modal from './Modal'

const messages = defineMessages({
  addProduct: {
    id: 'store/add-button.add-product',
    defaultMessage: 'Add Product',
  },
})

class AddItemContainer extends Component<Props> {
  public state = {
    isModalOpen: false,
    searchTerm: '',
    searchInput: '',
  }

  private debounceCall: NodeJS.Timeout | null | number = null

  private handleOpenModal = () => this.setState({ isModalOpen: true })

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleChangeSearch = (searchInput: string) => {
    clearInterval(this.debounceCall as NodeJS.Timeout)

    this.debounceCall = setTimeout(
      () => this.setState({ searchTerm: searchInput }),
      1000
    )

    this.setState({ searchInput })
  }

  public render() {
    const { intl } = this.props
    const { isModalOpen, searchInput } = this.state

    return (
      <>
        <Modal
          isModalOpen={isModalOpen}
          searchInput={searchInput}
          onCloseModal={this.handleCloseModal}
          onChangeSearch={this.handleChangeSearch}
        />
        <ButtonWithIcon
          icon={<IconPlus />}
          onClick={this.handleOpenModal}
          variation="secondary"
          block
        >
          {intl.formatMessage(messages.addProduct)}
        </ButtonWithIcon>
      </>
    )
  }
}

type Props = InjectedIntlProps

const enhance = compose<Props, {}>(injectIntl)

export default enhance(AddItemContainer)
