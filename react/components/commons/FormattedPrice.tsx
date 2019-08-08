import React, { PureComponent } from 'react'
import { FormattedNumber } from 'react-intl'

class FormattedPrice extends PureComponent<Props> {
  render() {
    const { value, currency } = this.props
    return (
      <FormattedNumber
        currency={currency}
        style="currency"
        value={value / 100}
      />
    )
  }
}

interface Props {
  value: number
  currency: string
}

export default FormattedPrice
