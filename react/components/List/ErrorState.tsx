import React, { FunctionComponent } from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import { Alert } from 'vtex.styleguide'

const messages = defineMessages({
  label: {
    id: 'store/subscription.fallback.error.refresh.message',
    defaultMessage: '',
  },
  content: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
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

interface Props extends InjectedIntlProps {
  refetch: () => void
}

export default injectIntl(ErrorStateSubscriptionsList)
