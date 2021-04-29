import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { compose } from 'recompose'
import {
  Modal,
  InputSearch,
  Spinner,
  Alert,
  ButtonWithIcon,
  IconCaretLeft,
  IconCaretRight,
} from 'vtex.styleguide'

import { withQueryWrapper, getRuntimeInfo } from '../../tracking'
import SEARCH_QUERY, {
  Args as SearchArgs,
  Result as SearchResult,
  SearchProduct,
} from '../../graphql/queries/search.gql'
import Item from './SearchItem'
import EmptyState from './EmptyState'
import { AddItemArgs } from '.'

const messages = defineMessages({
  title: {
    id: 'add-item-modal.title',
  },
  placeholder: {
    id: 'add-item-modal.search-placeholder',
  },
  searchLabel: {
    id: 'add-item-modal.search-label',
  },
  errorMessage: {
    id: 'subscription.fallback.error.message',
  },
})

const INSTANCE = 'SearchSubscribableProducts'

type State = 'loading' | 'results' | 'empty' | 'no-results'

const AddItemModal: FunctionComponent<Props> = ({
  onCloseModal,
  onChangeSearch,
  onPrevClickPagination,
  onNextClickPagination,
  isModalOpen,
  searchInput,
  page,
  intl,
  loading,
  products,
  totalCount,
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
  } else if (products && products?.length > 0) {
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
      container={window.top.document.body}
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
        <div className="mt8">
          <Alert type="error" onClose={onDismissError}>
            {intl.formatMessage(messages.errorMessage)}
          </Alert>
        </div>
      )}
      <div
        className={`mt8 ${
          state !== 'results' ? 'flex items-center justify-center' : ''
        }`}
        style={{ minHeight: '450px' }}
      >
        {state === 'results' ? (
          <>
            {products?.map((product) =>
              product?.items.map((sku) => (
                <div key={sku.skuId} className="mb8">
                  <Item
                    id={sku.skuId}
                    name={sku.name}
                    price={product.price}
                    currency={currency}
                    imageUrl={sku.imageUrl}
                    brand={product.brand}
                    measurementUnit={product.measurementUnit}
                    unitMultiplier={product.unitMultiplier}
                    onAddItem={onAddItem}
                    subscribedSkus={subscribedSkus}
                    targetPlan={targetPlan}
                    availablePlans={sku.plans}
                  />
                </div>
              ))
            )}
            <div className="bg-base w-100 pa6 absolute bottom-0 right-0">
              <div className="flex flex-row justify-end">
                <div className="mr1">
                  <ButtonWithIcon
                    icon={<IconCaretLeft size={11} />}
                    variation="secondary"
                    size="small"
                    onClick={() => onPrevClickPagination(page)}
                    disabled={page === 1}
                  />
                </div>
                <div className="ml1">
                  <ButtonWithIcon
                    icon={<IconCaretRight size={11} />}
                    variation="secondary"
                    size="small"
                    onClick={() => onNextClickPagination(page)}
                    disabled={
                      products && totalCount
                        ? 15 * (page - 1) + products.length >= totalCount
                        : false
                    }
                  />
                </div>
              </div>
            </div>
          </>
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
  onPrevClickPagination: (page: number) => void
  onNextClickPagination: (page: number) => void
  searchInput: string
  searchTerm: string
  currency: string
  page: number
  onAddItem: (args: AddItemArgs) => void
  displayError: boolean
  onDismissError: () => void
  subscribedSkus: string[]
  targetPlan: string | null
}

interface MappedProps {
  loading?: boolean
  products?: SearchProduct[]
  totalCount?: number
}

type Props = InnerProps & OuterProps & MappedProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  withQueryWrapper<OuterProps, SearchResult, SearchArgs, MappedProps>({
    getRuntimeInfo,
    workflowInstance: INSTANCE,
    document: SEARCH_QUERY,
    operationOptions: {
      skip: ({ isModalOpen }) => !isModalOpen,
      props: ({ data }) => ({
        loading: data?.loading ?? false,
        products: data?.searchProducts?.list ?? [],
        totalCount: data?.searchProducts?.totalCount ?? 0,
      }),
    },
  })
)

export default enhance(AddItemModal)
