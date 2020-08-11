import React, { Component } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { compose } from 'recompose'
import memoize from 'memoize-one'
import { graphql } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import {
  ButtonWithIcon,
  IconPlus,
  withToast,
  ShowToastArgs,
} from 'vtex.styleguide'
import { withRuntimeContext, RuntimeContext } from 'vtex.render-runtime'

import Modal from './Modal'
import ADD_ITEM_MUTATION, { Args } from '../../../graphql/mutations/addItem.gql'
import { logGraphqlError } from '../../../tracking'
import { INSTANCE } from '..'

const messages = defineMessages({
  addProduct: {
    id: 'store/add-item-button.add-product',
    defaultMessage: '',
  },
  success: {
    id: 'store/add-item.success',
    defaultMessage: '',
  },
})

const buildSet = memoize((subscribedSkus: OuterProps['subscribedSkus']) => {
  const set = new Set<string>()

  subscribedSkus.forEach((skuId) => set.add(skuId))

  return set
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
      1000
    )

    this.setState({ searchInput })
  }

  private isProductAvailable = (skuId: string) => {
    const set = buildSet(this.props.subscribedSkus)

    return set.has(skuId)
  }

  private handleAddItem = ({ skuId, quantity, setLoading }: AddItemArgs) => {
    const { showToast, subscriptionId, addItem, intl, runtime } = this.props

    setLoading(true)

    const variables = {
      item: { id: skuId, quantity },
      subscriptionId,
    }

    addItem({
      variables,
    })
      .then(() => showToast({ message: intl.formatMessage(messages.success) }))
      .catch((error: ApolloError) => {
        this.setState({ displayError: true })

        logGraphqlError({
          error,
          variables,
          runtime,
          type: 'MutationError',
          instance: `${INSTANCE}/AddItem`,
        })
      })
      .finally(() => setLoading(false))
  }

  private handleDismissError = () => this.setState({ displayError: false })

  public render() {
    const { intl, currency } = this.props
    const { isModalOpen, searchInput, searchTerm, displayError } = this.state

    return (
      <>
        <Modal
          isModalOpen={isModalOpen}
          searchInput={searchInput}
          searchTerm={searchTerm}
          currency={currency}
          onCloseModal={this.handleCloseModal}
          onChangeSearch={this.handleChangeSearch}
          isProductAvailable={this.isProductAvailable}
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

export interface AddItemArgs {
  skuId: string
  quantity: number
  setLoading: (loadingStatus: boolean) => void
}

interface OuterProps {
  subscriptionId: string
  currency: string
  subscribedSkus: string[]
}

type InnerProps = {
  addItem: (args: { variables: Args }) => Promise<void>
  showToast: (args: ShowToastArgs) => void
  runtime: RuntimeContext
} & InjectedIntlProps

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withToast,
  withRuntimeContext,
  graphql(ADD_ITEM_MUTATION, {
    name: 'addItem',
  })
)

export default enhance(AddItemContainer)
