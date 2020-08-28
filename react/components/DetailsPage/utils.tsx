import React from 'react'
import { IntlShape, defineMessages, MessageDescriptor } from 'react-intl'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { messages as statusMessages } from '../UpdateStatusButton'
import { messages as modalMessages } from '../ConfirmationModal'

const messages = defineMessages({
  confirmationMessage: {
    id: 'store/subscription.change.status.modal.confirmation',
  },
  orderAgainConfirmation: {
    id: 'store/subscription.execution.again.confirmation',
  },
  orderAgainDescription: {
    id: 'store/subscription.execution.again.description',
  },
  skipConfirm: {
    id: 'store/subscription.skip.confirm',
  },
  unskipConfirm: {
    id: 'store/subscription.unskip.confirm',
  },
  skipTitle: { id: 'store/subscription.skip.title' },
  skipDesc: { id: 'store/subscription.skip.text' },
  unSkipTitle: { id: 'store/subscription.unskip.title' },
  unSkipDesc: { id: 'store/subscription.unskip.text' },
})

export type SubscriptionAction =
  | 'skip'
  | 'unskip'
  | 'pause'
  | 'cancel'
  | 'restore'
  | 'orderNow'
  | 'changeAddress'
  | 'changePayment'
  | 'recreate'

export function retrieveModalConfig({
  intl,
  action,
  errorMessage,
  updateStatus,
  orderNow,
  updateSkip,
  onError,
  onCloseModal,
  isModalOpen,
}: {
  intl: IntlShape
  action: SubscriptionAction | null
  isModalOpen: boolean
  errorMessage: string | null
  updateStatus: (status: SubscriptionStatus) => unknown
  updateSkip: () => unknown
  orderNow: () => unknown
  onError: () => void
  onCloseModal: () => void
}) {
  let children
  let confirmationLabel = intl.formatMessage(messages.confirmationMessage)
  let onSubmit
  let displaySuccess = true

  const modalBody = ({
    title,
    desc,
  }: {
    title?: MessageDescriptor
    desc: MessageDescriptor
  }) => (
    <>
      {title && <div className="t-heading-4">{intl.formatMessage(title)}</div>}
      <div className="pt6">{intl.formatMessage(desc)}</div>
    </>
  )

  const isUnskip = action === 'unskip'
  switch (action) {
    case 'cancel':
      onSubmit = () => updateStatus('CANCELED')
      children = modalBody({
        title: statusMessages.cancelTitle,
        desc: statusMessages.cancelDescription,
      })
      break
    case 'pause':
      onSubmit = () => updateStatus('PAUSED')
      children = modalBody({
        title: statusMessages.pauseTitle,
        desc: statusMessages.pauseDescription,
      })
      break
    case 'restore':
      onSubmit = () => updateStatus('ACTIVE')
      children = modalBody({
        title: statusMessages.restoreTitle,
        desc: statusMessages.restoreDescription,
      })
      break
    case 'orderNow':
      displaySuccess = false

      onSubmit = orderNow
      confirmationLabel = intl.formatMessage(messages.orderAgainConfirmation)
      children = modalBody({ desc: messages.orderAgainDescription })
      break
    default:
      onSubmit = updateSkip
      confirmationLabel = intl.formatMessage(
        isUnskip ? messages.unskipConfirm : messages.skipConfirm
      )

      children = modalBody({
        title: isUnskip ? messages.unSkipTitle : messages.skipTitle,
        desc: isUnskip ? messages.unSkipDesc : messages.skipDesc,
      })
      break
  }

  const modalConfigs = {
    onSubmit,
    onError,
    confirmationLabel,
    children,
    isModalOpen,
    errorMessage,
    onCloseModal,
    cancelationLabel: intl.formatMessage(modalMessages.cancelationLabel),
    successMessage: displaySuccess
      ? intl.formatMessage(modalMessages.successMessage)
      : undefined,
  }

  return modalConfigs
}
