import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

const Title = ({ items, intl }) => {
  if (items.length === 1) {
    return (
      <a className="c-on-base" target="_blank" href={items[0].sku.detailUrl}>
        <span className="underline">{`${items[0].sku.productName} - ${
          items[0].sku.name
        }`}</span>
      </a>
    )
  }

  return intl.formatMessage(
    { id: 'subscription.view.title' },
    { value: items.length }
  )
}

Title.propTypes = {
  intl: intlShape.isRequired,
  items: PropTypes.array.isRequired,
}

export default injectIntl(Title)
