import React from 'react'
import { intlShape, injectIntl } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const EmptySubscription = ({ intl }) => {
  return (
    <EmptyState
      title={
        <span className="c-on-base">
          {intl.formatMessage({ id: 'subscriptions.notFound.title' })}
        </span>
      }>
      {intl.formatMessage({ id: 'subscriptions.notFound.text' })}
    </EmptyState>
  )
}

EmptySubscription.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(EmptySubscription)
