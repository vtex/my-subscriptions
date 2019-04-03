import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Button, Modal } from 'vtex.styleguide'

const RemoveItemConfirmModal: FunctionComponent<Props> = ({
  onClose,
  onSave,
  isModalOpen,
  isLoading,
  intl,
}) => {
  return (
    <Modal centered isOpen={isModalOpen} onClose={onClose}>
      <span className="db b f5">
        {intl.formatMessage({
          id: 'subscription.itemCancel.title',
        })}
      </span>
      <span className="db pt6">
        {intl.formatMessage({
          id: 'subscription.itemCancel.text',
        })}
      </span>

      <div className="flex flex-row justify-end mt7">
        <span className="mr4">
          <Button size="small" variation="tertiary" onClick={onClose}>
            {intl.formatMessage({ id: 'commons.no' })}
          </Button>
        </span>
        <Button
          size="small"
          variation="primary"
          isLoading={isLoading}
          onClick={onSave}>
          {intl.formatMessage({ id: 'commons.yes' })}
        </Button>
      </div>
    </Modal>
  )
}

interface Props extends InjectedIntlProps {
  onClose: () => void
  onSave: () => void
  isModalOpen: boolean
  isLoading: boolean
}

export default injectIntl(RemoveItemConfirmModal)
