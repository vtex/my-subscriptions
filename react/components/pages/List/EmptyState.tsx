import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const EmptySubscriptionsGroupList: FunctionComponent<InjectedIntlProps> = ({ intl }) => {
  return (
    <div className="mr0 pt5 pl2 w-100 tc">
      <EmptyState
        title={
          <span className="c-on-base">
            {intl.formatMessage({ id: 'subscriptions.notFound.title' })}
          </span>
        }>
        {intl.formatMessage({ id: 'subscriptions.notFound.text' })}
      </EmptyState>
    </div>
  )
}

export default injectIntl(EmptySubscriptionsGroupList)
