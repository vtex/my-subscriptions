import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const messages = defineMessages({
  title: { id: 'subscription.notFound.title' },
  body: { id: 'subscription.notFound.text' },
})

const EmptyStateSubscriptionsList: FunctionComponent<WrappedComponentProps> = ({
  intl,
}) => {
  return (
    <EmptyState title={intl.formatMessage(messages.title)}>
      {intl.formatMessage(messages.body)}
    </EmptyState>
  )
}

export default injectIntl(EmptyStateSubscriptionsList)
