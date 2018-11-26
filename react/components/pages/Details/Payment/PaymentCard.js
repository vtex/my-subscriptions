import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

import PaymentDisplay from '../PaymentDisplay'

class Payment extends Component {
  handleInvoiceButtonClick = bankInvoiceUrl => {
    window.open(bankInvoiceUrl, '_blank')
  }

  render() {
    const { subscription, onEdit, intl } = this.props
    const lastGeneratedOrder = subscription.instances.find(
      instance => instance.orderInfo && instance.orderInfo.paymentUrl
    )
    const bankInvoiceUrl =
      lastGeneratedOrder && lastGeneratedOrder.orderInfo.paymentUrl

    return (
      <div className="card bw1 bg-base pa6 ba b--muted-5">
        <div>
          <div>
            <div className="flex flex-row">
              <div className="db-s di-ns b f4 tl c-on-base">
                {intl.formatMessage({
                  id: 'subscription.payment',
                })}
              </div>
              <div className="ml-auto">
                <Button size="small" variation="tertiary" onClick={onEdit}>
                  <span>
                    {intl.formatMessage({
                      id: 'subscription.actions.edit',
                    })}
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex pt3-s pt0-ns w-100 mr-auto flex-row-ns flex-column-s">
              <div className="f5-ns f6-s pt5 lh-solid dib-ns c-on-base">
                <PaymentDisplay
                  purchaseSettings={subscription.purchaseSettings}
                />
              </div>
              {subscription.purchaseSettings.paymentMethod
                .paymentSystemGroup === 'bankInvoice' &&
                bankInvoiceUrl && (
                  <div className="pl9-ns pt2-ns pt6-s">
                    <Button
                      block
                      size="small"
                      onClick={() =>
                        this.handleInvoiceButtonClick(bankInvoiceUrl)
                      }
                      variation="secondary"
                    >
                      <span>
                        {intl.formatMessage({
                          id: 'subscription.payment.invoice',
                        })}
                      </span>
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Payment.propTypes = {
  subscription: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  paymentMethod: PropTypes.object,
  intl: intlShape.isRequired,
}

export default injectIntl(Payment)
