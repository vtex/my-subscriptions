import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const EmptyStateSubscriptionsGroupList: FunctionComponent<InjectedIntlProps> = ({ intl }) => {
  return (
    <EmptyState
      title={intl.formatMessage({ id: 'subscriptions.notFound.title' })}>
      {intl.formatMessage({ id: 'subscriptions.notFound.text' })}
    </EmptyState>
  )
}

export default injectIntl(EmptyStateSubscriptionsGroupList)
