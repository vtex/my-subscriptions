import React, { FunctionComponent } from 'react'
import { Alert } from 'vtex.styleguide'

import { SubscriptionStatus } from '../constants'

const EditAlert: FunctionComponent<Props> = ({
  subscriptionStatus,
  actionLabelMessage,
  noActionMessage,
  onAction,
  children,
}) => {
  const canBeEdited = subscriptionStatus === SubscriptionStatus.Active

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
