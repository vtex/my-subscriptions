import type { FunctionComponent } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { defineMessages, injectIntl } from 'react-intl'
import { Alert } from 'vtex.styleguide'

const messages = defineMessages({
  label: {
    id: 'subscription.fallback.error.refresh.message',
  },
  content: {
    id: 'subscription.fallback.error.message',
  },
})

const ErrorStateSubscriptionsList: FunctionComponent<Props> = ({
  refetch,
  intl,
}) => {
  return (
    <div className="mw7 center">
      <Alert
        type="error"
        action={{
          label: intl.formatMessage(messages.label),
          onClick: () => refetch(),
        }}
      >
        {intl.formatMessage(messages.content)}
      </Alert>
    </div>
  )
}

interface Props extends WrappedComponentProps {
  refetch: () => void
}

export default injectIntl(ErrorStateSubscriptionsList)
