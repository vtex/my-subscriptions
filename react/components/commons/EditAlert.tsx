import React, { FunctionComponent, Fragment } from 'react'
import {
  injectIntl,
  WrappedComponentProps,
  MessageDescriptor,
} from 'react-intl'
import { Alert } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const EditAlert: FunctionComponent<Props & WrappedComponentProps> = ({
  subscriptionStatus,
  actionLabelMessage,
  noActionMessage,
  onAction,
  intl,
  children,
}) => {
  const canBeEdited = subscriptionStatus === 'ACTIVE'

  return canBeEdited ? (
    <Alert
      type="error"
      action={
        canBeEdited
          ? {
              label: intl.formatMessage(actionLabelMessage),
              onClick: () => onAction(),
            }
          : undefined
      }
    >
      {children}
    </Alert>
  ) : (
    <Fragment>{intl.formatMessage(noActionMessage)}</Fragment>
  )
}

interface Props {
  subscriptionStatus: SubscriptionStatus
  actionLabelMessage: MessageDescriptor
  noActionMessage: MessageDescriptor
  onAction: () => void
  children?: any
}

export default injectIntl(EditAlert)
