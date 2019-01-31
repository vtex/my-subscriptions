import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import MediaQuery from 'react-responsive'
import groupBy from 'lodash/groupBy'
import { Radio, Alert, Dropdown } from 'vtex.styleguide'

import PaymentSkeleton from './PaymentSkeleton'
import EditButtons from '../EditButtons'
import GetPaymentSystems from '../../../../graphql/getPaymentSystems.gql'

class EditPayment extends Component {
  transformCards(creditCards) {
    return creditCards.map(card => {
      return {
        value: card.paymentAccount.accountId,
        label: `${this.props.intl.formatMessage({
          id: 'subscription.payment.final',
        })} ${card.paymentAccount.cardNumber.slice(-4)}`,
      }
    })
  }

  render() {
    const {
      payments,
      onChangePayment,
      onChangeCard,
      account,
      paymentSystemGroup,
      showErrorAlert,
      errorMessage,
      intl,
    } = this.props

    const { paymentSystems, loading } = payments
    const CREDIT_CARD = 'creditCard'

    if (loading || !paymentSystems) {
      return <PaymentSkeleton />
    }

    const groupedPayments = groupBy(
      paymentSystems,
      pay => pay.paymentSystemGroup
    )

    return (
      <div className="card bg-base pa6 ba bw1 b--muted-5">
        <div className="flex flex-row">
          <div className="db-s di-ns b f4 tl c-on-base">
            {intl.formatMessage({
              id: 'subscription.payment',
            })}
          </div>
          <MediaQuery minWidth={640}>
            <EditButtons
              isLoading={this.props.isLoading}
              onCancel={this.props.onCancel}
              onSave={this.props.onSave}
              disabled={paymentSystemGroup === CREDIT_CARD && !account}
            />
          </MediaQuery>
        </div>
        <div className="mr-auto pt5 flex flex-column justify-center">
          {showErrorAlert && (
            <div className="mb6">
              <Alert
                type="error"
                autoClose={3000}
                onClose={this.handleCloseSuccessAlert}>
                {intl.formatMessage({
                  id: `${errorMessage}`,
                })}
              </Alert>
            </div>
          )}
          {Object.keys(groupedPayments).map(group => (
            <div className="pb4-ns pb3-s pt3-s pt0-ns" key={group}>
              <Radio
                id={group}
                label={intl.formatMessage({
                  id: `paymentData.paymentGroup.${group}.name`,
                })}
                name={group}
                checked={paymentSystemGroup === group}
                onChange={onChangePayment}
                value={groupedPayments[group][0].paymentSystem}
              />
              {groupedPayments[group][0].paymentSystemGroup === CREDIT_CARD && (
                <div className="w-30-ns w-100-s ml6-ns">
                  <Dropdown
                    options={this.transformCards(groupedPayments.creditCard)}
                    placeholder={intl.formatMessage({
                      id: 'subscription.payment.chooseOne',
                    })}
                    disabled={paymentSystemGroup !== CREDIT_CARD}
                    value={account}
                    onChange={onChangeCard}
                  />
                </div>
              )}
            </div>
          ))}
          <MediaQuery maxWidth={640}>
            <div className="flex pt3">
              <EditButtons
                isLoading={this.props.isLoading}
                onCancel={this.props.onCancel}
                onSave={this.props.onSave}
                disabled={paymentSystemGroup === CREDIT_CARD && !account}
              />
            </div>
          </MediaQuery>
        </div>
      </div>
    )
  }
}

const paymentsQuery = {
  name: 'payments',
  options({ orderGroup }) {
    return {
      variables: {
        orderGroup,
      },
    }
  },
}

EditPayment.propTypes = {
  intl: intlShape.isRequired,
  onChangeCard: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onChangePayment: PropTypes.func.isRequired,
  payments: PropTypes.object,
  paymentSystemGroup: PropTypes.string.isRequired,
  account: PropTypes.string,
  showErrorAlert: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  orderGroup: PropTypes.string.isRequired,
}

export default compose(graphql(GetPaymentSystems, paymentsQuery))(
  injectIntl(EditPayment)
)
