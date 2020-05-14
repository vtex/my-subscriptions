import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const EmptyStateSubscriptionsGroupList: FunctionComponent<WrappedComponentProps> = ({
  intl,
}) => {
  return (
    <EmptyState
      title={intl.formatMessage({ id: 'subscriptions.notFound.title' })}
    >
      {intl.formatMessage({ id: 'subscriptions.notFound.text' })}
    </EmptyState>
  )
}

export default injectIntl(EmptyStateSubscriptionsGroupList)
