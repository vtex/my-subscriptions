import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import { intlShape, injectIntl } from 'react-intl'
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion'
import parcelify from '@vtex/delivery-packages'
import {
  IconCaretDown as CaretDown,
  IconCaretUp as CaretUp,
} from 'vtex.styleguide'
import {
  constants,
  utils,
  OrderStatus,
  ProgressBar,
} from 'vtex.my-account-commons/OrderProgressBar'

import GET_ORDER from '../../../../graphql/getOrder.gql'
import PaymentFlagIcon from '../../../commons/PaymentFlagIcon'
import FormattedPrice from '../../../commons/FormattedPrice'
import SkeletonLoader from '../../../commons/SkeletonLoader'
import FormattedDate from '../../../commons/FormattedDate'

import PackageHandler from './PackageHandler'

const { generateProgressBarStates } = utils
const { progressBarStates } = constants

class OrderHistory extends Component {
  render() {
    const { orderData, intl } = this.props
    const { order, loading } = orderData

    if (loading || !order) {
      return (
        <AccordionItemTitle className="title pa5 bb bl br b--muted-5 w-100">
          <SkeletonLoader width={10} />
        </AccordionItemTitle>
      )
    }

    const packages = parcelify(order)
    return (
      <AccordionItem hideBodyClassName="invert-arrow">
        <AccordionItemTitle className="title pa5 bw1 b--muted-5 w-100 tl">
          <div className="b flex align-center justify-between">
            <FormattedDate date={order.creationDate} style="short" />
            <div className="arrow-down justify-end c-action-primary flex flex-column justify-center">
              <CaretDown size={15} color="currentColor" />
            </div>
            <div className="arrow-up justify-end c-action-primary flex flex-column justify-center">
              <CaretUp size={15} color="currentColor" />
            </div>
          </div>
        </AccordionItemTitle>
        <AccordionItemBody className="accordion__body pa5 bg-black-025 b--muted-5">
          <div className="flex flex-row">
            <div className="pb5">
              <span className="b db">
                {intl.formatMessage({
                  id: 'subscription.payment',
                })}
              </span>
              <div className="f5-ns f6-s pt2 lh-solid dib-ns">
                {order.paymentData.transactions[0].payments[0]
                  .paymentSystemName === 'creditCard' ? (
                    <div>
                      <PaymentFlagIcon
                        group={
                          order.paymentData.transactions[0].payments[0].group
                        }
                        type={
                          order.paymentData.transactions[0].payments[0]
                            .paymentSystemName
                        }
                        size={400}
                      />
                      <span className="fw3 f5-ns f6-s">
                        {`${intl.formatMessage({
                          id: 'subscription.payment.final',
                        })} ${
                          order.paymentData.transactions[0].payments[0].lastDigits
                        }`}
                      </span>
                    </div>
                  ) : (
                    <span className="fw3 f5-ns f6-s">
                      {intl.formatMessage({
                        id: `paymentData.paymentGroup.${
                          order.paymentData.transactions[0].payments[0].group
                        }.name`,
                      })}
                    </span>
                  )}
              </div>
            </div>
            <div className="pl9-ns pl5-s">
              <span className="db b">
                {intl.formatMessage({
                  id: 'subscription.totalValue',
                })}
              </span>
              <span className="fw3 f5-ns f6-s">
                <FormattedPrice
                  value={order.value}
                  currency={order.storePreferencesData.currencyCode}
                />
              </span>
            </div>
          </div>
          <div className="pt5-s pt0-ns pb9-l pb5-m pb5-s ">
            <OrderStatus
              status={order.status}
              packages={packages}
              render={index => (
                <ProgressBar
                  states={generateProgressBarStates(
                    progressBarStates,
                    index,
                    packages
                  )}
                  currentState={index}
                />
              )}
            />
          </div>
          <PackageHandler order={order} packages={packages} />
        </AccordionItemBody>
      </AccordionItem>
    )
  }
}

OrderHistory.propTypes = {
  intl: intlShape.isRequired,
  orderId: PropTypes.string.isRequired,
  orderData: PropTypes.object,
  order: PropTypes.object,
}

const orderQuery = {
  name: 'orderData',
  options({ orderId }) {
    return {
      variables: {
        orderId: orderId,
      },
    }
  },
}

export default compose(graphql(GET_ORDER, orderQuery))(injectIntl(OrderHistory))
