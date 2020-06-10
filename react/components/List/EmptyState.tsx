import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const messages = defineMessages({
  title: { id: 'store/subscription.notFound.title', defaultMessage: '' },
  body: { id: 'store/subscription.notFound.text', defaultMessage: '' },
})

const EmptyStateSubscriptionsList: FunctionComponent<InjectedIntlProps> = ({
  intl,
}) => {
  return (
    <EmptyState title={intl.formatMessage(messages.title)}>
      {intl.formatMessage(messages.body)}
    </EmptyState>
  )
}

export default injectIntl(EmptyStateSubscriptionsList)
