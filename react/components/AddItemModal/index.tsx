import React, { Component } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { ButtonWithIcon, IconPlus } from 'vtex.styleguide'

import Modal from './Modal'

const messages = defineMessages({
  addProduct: {
    id: 'store/add-item-button.add-product',
    defaultMessage: '',
  },
})

class AddItemContainer extends Component<Props> {
  public state = {
    isModalOpen: false,
    searchTerm: '',
    searchInput: '',
    subscribedSkus: new Set<string>(),
    displayError: false,
  }

  private debounceCall: NodeJS.Timeout | null | number = null

  private handleOpenModal = () => this.setState({ isModalOpen: true })

  private handleCloseModal = () => this.setState({ isModalOpen: false })

  private handleChangeSearch = (searchInput: string) => {
    clearInterval(this.debounceCall as NodeJS.Timeout)

    this.debounceCall = setTimeout(
      () => this.setState({ searchTerm: searchInput }),
      400
    )

    this.setState({ searchInput })
  }

  private handleAddItem = ({ setLoading, ...rest }: AddItemArgs) => {
    setLoading(true)

    this.props.onAddItem({
      ...rest,
      onError: () => this.setState({ displayError: true }),
      onFinish: () => setLoading(false),
    })
  }

  private handleDismissError = () => this.setState({ displayError: false })

  public render() {
    const { intl, currency, targetPlan, subscribedSkus } = this.props
    const { isModalOpen, searchInput, searchTerm, displayError } = this.state

    return (
      <>
        <Modal
          targetPlan={targetPlan}
          subscribedSkus={subscribedSkus}
          isModalOpen={isModalOpen}
          searchInput={searchInput}
          searchTerm={searchTerm}
          currency={currency}
          onCloseModal={this.handleCloseModal}
          onChangeSearch={this.handleChangeSearch}
          onAddItem={this.handleAddItem}
          onDismissError={this.handleDismissError}
          displayError={displayError}
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

type Item = {
  skuId: string
  quantity: number
  name: string
  price: number
  unitMultiplier: number
  measurementUnit: string
  brand: string
  imageUrl: string
  plans: string[]
}

export type AddItemArgs = {
  setLoading: (loadingStatus: boolean) => void
} & Item

export type OnAddItemArgs = {
  onError: () => void
  onFinish: () => void
} & Item

interface OuterProps {
  currency: string
  targetPlan: string | null
  subscribedSkus: string[]
  onAddItem: (args: OnAddItemArgs) => void
}

type Props = WrappedComponentProps & OuterProps

export default injectIntl(AddItemContainer)
