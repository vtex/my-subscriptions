import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Alert } from 'vtex.styleguide'

const ErrorStateSubscriptionsGroupList: FunctionComponent<
  Props & InjectedIntlProps
> = ({ intl, data }) => {
  return (
    <div className="mw7 center">
      <Alert
        type="error"
        action={{
          label: intl.formatMessage({
            id: 'subscription.fallback.error.refresh.message',
          }),
          onClick: () => data && data.refetch(),
        }}>
        {intl.formatMessage({ id: 'subscription.fallback.error.message' })}
      </Alert>
    </div>
  )
}

export default injectIntl(ErrorStateSubscriptionsGroupList)

interface Props {
  data?: GraphqlDataProp
}

interface GraphqlDataProp {
  refetch: () => void
}
