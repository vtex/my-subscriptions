import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

import PaymentFlagIcon from '../../commons/PaymentFlagIcon'

class PaymentDisplay extends Component {
  render() {
    const { purchaseSettings } = this.props
    return (
      <div>
        {purchaseSettings.paymentMethod.paymentAccount ? (
          <div>
            <PaymentFlagIcon
              type={purchaseSettings.paymentMethod.paymentSystemName}
              size={400}
            />
            <span className="fw3 f5-ns f6-s">
              {`${this.props.intl.formatMessage({
                id: 'subscription.payment.final',
              })} ${purchaseSettings.paymentMethod.paymentAccount.cardNumber.slice(
                -4
              )}`}
            </span>
          </div>
        ) : (
          <span className="fw3 f5-ns f6-s">
            {this.props.intl.formatMessage({
              id: `paymentData.paymentGroup.${
                purchaseSettings.paymentMethod.paymentSystemGroup
              }.name`,
            })}
          </span>
        )}
      </div>
    )
  }
}

PaymentDisplay.propTypes = {
  intl: intlShape.isRequired,
  purchaseSettings: PropTypes.object.isRequired,
}

export default injectIntl(PaymentDisplay)
