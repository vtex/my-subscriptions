import React, { FunctionComponent } from 'react'
import { Alert } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const EditAlert: FunctionComponent<Props> = ({
  subscriptionStatus,
  actionLabelMessage,
  noActionMessage,
  onAction,
  children,
}) => {
  const canBeEdited = subscriptionStatus === 'ACTIVE'

  return canBeEdited ? (
    <Alert
      type="error"
      action={
        canBeEdited
          ? {
              label: actionLabelMessage,
              onClick: () => onAction(),
            }
          : undefined
      }
    >
      {children}
    </Alert>
  ) : (
    <>{noActionMessage}</>
  )
}

interface Props {
  subscriptionStatus: SubscriptionStatus
  actionLabelMessage: string
  noActionMessage: string
  onAction: () => void
}

export default EditAlert
