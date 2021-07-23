import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Modal } from 'vtex.styleguide'

import HistoryList from './HistoryList'

const CSS_HANDLES = ['historyList']

const SubscriptionHistory: FunctionComponent<Props> = ({
  subscriptionId,
  isOpen,
  onClose,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <Modal
      title={<FormattedMessage id="subscription.history" />}
      isOpen={isOpen}
      onClose={onClose}
      responsiveFullScreen
      container={window.top.document.body}
    >
      <div className={handles.historyList}>
        <HistoryList subscriptionId={subscriptionId} perPage={5} />
      </div>
    </Modal>
  )
}

interface Props {
  subscriptionId: string
  isOpen: boolean
  onClose: () => void
}

export default SubscriptionHistory
