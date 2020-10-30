import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'vtex.styleguide'

import HistoryList from './HistoryList'

const SubscriptionHistory: FunctionComponent<Props> = ({
  subscriptionId,
  isOpen,
  onClose,
}) => (
  <Modal
    title={<FormattedMessage id="store/subscription.history" />}
    isOpen={isOpen}
    onClose={onClose}
    responsiveFullScreen
    container={window.top.document.body}
  >
    <HistoryList subscriptionId={subscriptionId} perPage={5} />
  </Modal>
)

interface Props {
  subscriptionId: string
  isOpen: boolean
  onClose: () => void
}

export default SubscriptionHistory
