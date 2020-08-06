import React, { FunctionComponent } from 'react'
import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl'
import { compose } from 'recompose'
import { Modal, InputSearch } from 'vtex.styleguide'

const messages = defineMessages({
  title: {
    id: 'store/add-item-modal.title',
    defaultMessage: 'Add new product',
  },
  placeholder: {
    id: 'store/add-item-modal.placeholder',
    defaultMessage: 'Search',
  },
  searchLabel: {
    id: 'store/add-item-modal.search-label',
    defaultMessage: 'What are you looking for?',
  },
})

const AddItemModal: FunctionComponent<Props> = ({
  onCloseModal,
  onChangeSearch,
  isModalOpen,
  searchInput,
  intl,
}) => {
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
        onChange={(e: any) => onChangeSearch(e.target.value)}
        size="regular"
        value={searchInput}
      />
    </Modal>
  )
}

type InnerProps = InjectedIntlProps
interface OuterProps {
  isModalOpen: boolean
  onCloseModal: () => void
  onChangeSearch: (term: string) => void
  searchInput: string
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(injectIntl)

export default enhance(AddItemModal)
