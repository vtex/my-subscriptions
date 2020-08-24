import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { compose } from 'recompose'
import { Modal, InputSearch, Spinner, Alert } from 'vtex.styleguide'

import { queryWrapper } from '../../tracking'
import SEARCH_QUERY, {
  Args as SearchArgs,
  Result as SearchResult,
  SubscribableItem,
} from '../../graphql/queries/search.gql'
import Item from './SearchItem'
import EmptyState from './EmptyState'
import { AddItemArgs } from '.'

const messages = defineMessages({
  title: {
    id: 'store/add-item-modal.title',
    defaultMessage: '',
  },
  placeholder: {
    id: 'store/add-item-modal.search-placeholder',
    defaultMessage: '',
  },
  searchLabel: {
    id: 'store/add-item-modal.search-label',
    defaultMessage: '',
  },
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
  },
})

const INSTANCE = 'SearchSubscribableProducts'

type State = 'loading' | 'results' | 'empty' | 'no-results'

const AddItemModal: FunctionComponent<Props> = ({
  onCloseModal,
  onChangeSearch,
  isModalOpen,
  searchInput,
  intl,
  loading,
  items,
  currency,
  onAddItem,
  displayError,
  onDismissError,
  subscribedSkus,
  targetPlan,
}) => {
  let state: State
  if (loading) {
    state = 'loading'
  } else if (items && items.length > 0) {
    state = 'results'
  } else {
    state = searchInput.length === 0 ? 'empty' : 'no-results'
  }

  return (
    <Modal
      title={intl.formatMessage(messages.title)}
      isOpen={isModalOpen}
      onClose={onCloseModal}
      responsiveFullScreen
    >
      <InputSearch
        label={intl.formatMessage(messages.searchLabel)}
        placeholder={intl.formatMessage(messages.placeholder)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeSearch(e.target.value)
        }
        size="regular"
        value={searchInput}
      />
      {displayError && (
        <div className="mt7">
          <Alert type="error" onClose={onDismissError}>
            {intl.formatMessage(messages.errorMessage)}
          </Alert>
        </div>
      )}
      <div
        className={`mt7 ${
          state !== 'results' ? 'flex items-center justify-center' : ''
        }`}
        style={{ minHeight: '450px' }}
      >
        {state === 'results' ? (
          items?.map((item) => (
            <div key={item.skuId} className="mb6">
              <Item
                id={item.skuId}
                name={item.name}
                price={item.price}
                currency={currency}
                imageUrl={item.imageUrl}
                brand={item.brand}
                measurementUnit={item.measurementUnit}
                unitMultiplier={item.unitMultiplier}
                onAddItem={onAddItem}
                subscribedSkus={subscribedSkus}
                targetPlan={targetPlan}
                availablePlans={item.plans}
              />
            </div>
          ))
        ) : state === 'loading' ? (
          <Spinner />
        ) : (
          <EmptyState state={state} />
        )}
      </div>
    </Modal>
  )
}

type InnerProps = WrappedComponentProps

interface OuterProps {
  isModalOpen: boolean
  onCloseModal: () => void
  onChangeSearch: (term: string) => void
  searchInput: string
  searchTerm: string
  currency: string
  onAddItem: (args: AddItemArgs) => void
  displayError: boolean
  onDismissError: () => void
  subscribedSkus: string[]
  targetPlan: string
}

interface MappedProps {
  loading?: boolean
  items?: SubscribableItem[]
}

type Props = InnerProps & OuterProps & MappedProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  queryWrapper<OuterProps, SearchResult, SearchArgs, MappedProps>(
    INSTANCE,
    SEARCH_QUERY,
    {
      props: ({ data }) => ({
        loading: data?.loading,
        items: data?.search,
      }),
    }
  )
)

export default enhance(AddItemModal)
