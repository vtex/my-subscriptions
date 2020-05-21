import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const messages = defineMessages({
  title: { id: 'subscriptions.notFound.title', defaultMessage: '' },
  body: { id: 'subscriptions.notFound.text', defaultMessage: '' },
})

const EmptyStateSubscriptionsGroupList: FunctionComponent<InjectedIntlProps> = ({
  intl,
}) => {
  return (
    <EmptyState title={intl.formatMessage(messages.title)}>
      {intl.formatMessage(messages.body)}
    </EmptyState>
  )
}

export default injectIntl(EmptyStateSubscriptionsGroupList)
