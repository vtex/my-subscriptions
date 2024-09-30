import React from 'react'
import type { IntlShape, MessageDescriptor } from 'react-intl'
import { defineMessages } from 'react-intl'
import type { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { messages as statusMessages } from '../UpdateStatusButton'
import { messages as modalMessages } from '../ConfirmationModal'

const messages = defineMessages({
  confirmationMessage: {
    id: 'subscription.change.status.modal.confirmation',
  },
  orderAgainConfirmation: {
    id: 'subscription.execution.again.confirmation',
  },
  orderAgainDescription: {
    id: 'subscription.execution.again.description',
  },
  skipConfirm: {
    id: 'subscription.skip.confirm',
  },
  unskipConfirm: {
    id: 'subscription.unskip.confirm',
  },
  skipTitle: { id: 'subscription.skip.title' },
  skipDesc: { id: 'subscription.skip.text' },
  unSkipTitle: { id: 'subscription.unskip.title' },
  unSkipDesc: { id: 'subscription.unskip.text' },
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

export function goToElement({
  id,
  option = 'center',
}: {
  id: string
  option?: ScrollLogicalPosition
}) {
  document.getElementById(id)?.scrollIntoView({ block: option })
}
