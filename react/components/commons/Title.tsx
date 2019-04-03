import React, { FunctionComponent, Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

const Title: FunctionComponent<Props> = ({ items, intl }) => {
  if (items.length === 1) {
    return (
      <a className="c-on-base" target="_blank" href={items[0].sku.detailUrl}>
        <span className="underline">{`${items[0].sku.productName} - ${
          items[0].sku.name
        }`}</span>
      </a>
    )
  }

  return (
    <Fragment>
      {intl.formatMessage(
        { id: 'subscription.view.title' },
        { value: items.length }
      )}
    </Fragment>
  )
}

interface Props extends InjectedIntlProps {
  items: SubscriptionType[]
}

export default injectIntl(Title)
