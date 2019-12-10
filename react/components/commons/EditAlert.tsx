import React, { FunctionComponent, Fragment } from 'react'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { Alert } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const EditAlert: FunctionComponent<Props & InjectedIntlProps> = ({
  subscriptionStatus,
  actionLabelMessage,
  noActionMessage,
  onAction,
  intl,
  children,
}) => {
  const canBeEdited = subscriptionStatus === SubscriptionStatus.Active

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
  actionLabelMessage: FormattedMessage.MessageDescriptor
  noActionMessage: FormattedMessage.MessageDescriptor
  onAction: () => void
}

export default injectIntl(EditAlert)
