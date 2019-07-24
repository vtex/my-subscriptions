import { FetchPolicy } from 'apollo-client'
import groupBy from 'lodash/groupBy'
import React, { FunctionComponent } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { branch, compose, renderComponent, renderNothing } from 'recompose'
import { Button, Dropdown, Radio } from 'vtex.styleguide'

import { PaymentGroupEnum, TagTypeEnum } from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import GetPaymentSystems from '../../../../graphql/getPaymentSystems.gql'
import EditButtons from '../EditButtons'
import PaymentSkeleton from './PaymentSkeleton'

const EditPayment: FunctionComponent<InnerProps & OuterProps> = ({
  payments,
  isLoading,
  onCancel,
  onSave,
  onChangePayment,
  onChangeCard,
  onCloseAlert,
  account,
  paymentSystemGroup,
  showAlert,
  errorMessage,
  intl,
  history,
}) => {
  const groupedPayments = groupBy(
    payments.paymentSystems,
    (pay: PaymentMethod) => pay.paymentSystemGroup
  )

  return (
    <div className="bg-base pa6 ba bw1 b--muted-5">
      <div className="flex flex-row">
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({
            id: 'subscription.payment',
          })}
        </div>
      </div>
      <div className="mr-auto pt5 flex flex-column justify-center">
        <Alert
          type={TagTypeEnum.Error}
          onClose={onCloseAlert}
          visible={showAlert}
          contentId={errorMessage}
        />
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
            {groupedPayments[group][0].paymentSystemGroup ===
              PaymentGroupEnum.CreditCard && (
              <div className="w-40-ns w-100-s ml6-ns flex">
                <div className="w-50 mr4">
                  <Dropdown
                    options={transformCards(groupedPayments.creditCard, intl)}
                    placeholder={intl.formatMessage({
                      id: 'subscription.payment.chooseOne',
                    })}
                    disabled={
                      paymentSystemGroup !== PaymentGroupEnum.CreditCard
                    }
                    value={account}
                    onChange={onChangeCard}
                  />
                </div>
                <Button
                  variation="tertiary"
                  size="small"
                  onClick={() => goToCreateCard(history)}
                >
                  {intl.formatMessage({
                    id: `subcription.add.new.card`,
                  })}
                </Button>
              </div>
            )}
          </div>
        ))}
        <div className="flex pt3">
          <EditButtons
            isLoading={isLoading}
            onCancel={onCancel}
            onSave={onSave}
            disabled={
              paymentSystemGroup === PaymentGroupEnum.CreditCard && !account
            }
          />
        </div>
      </div>
    </div>
  )
}

const paymentsQuery = {
  name: 'payments',
  options({ orderGroup }: OuterProps) {
    return {
      fetchPolicy: 'network-only' as FetchPolicy,
      variables: {
        orderGroup,
      },
    }
  },
}

function transformCards(creditCards: any[], intl: any) {
  return creditCards.map(card => {
    return {
      label: `${intl.formatMessage({
        id: 'subscription.payment.final',
      })} ${card.paymentAccount.cardNumber.slice(-4)}`,
      value: card.paymentAccount.accountId,
    }
  })
}

function goToCreateCard(history: any) {
  const here = history.location.pathname

  history.push({
    pathname: '/cards/new',
    search: `?returnUrl=${here}`,
  })
}

interface QueryResults {
  loading: boolean
  paymentSystems: PaymentMethod[]
}

interface OuterProps {
  onChangeCard: (e: any) => void
  onSave: () => void
  onCancel: () => void
  onChangePayment: (e: any) => void
  onCloseAlert: () => void
  isLoading: boolean
  paymentSystemGroup: string | null
  account: string | null
  showAlert: boolean
  errorMessage: string
  orderGroup: string
}

interface InnerProps extends InjectedIntlProps {
  payments: QueryResults
  history: any
}

export default compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  withRouter,
  graphql(GetPaymentSystems, paymentsQuery),
  branch(
    ({ payments: { loading } }: InnerProps) => loading,
    renderComponent(PaymentSkeleton)
  ),
  branch(
    ({ payments: { paymentSystems } }: InnerProps) => !paymentSystems,
    renderNothing
  )
)(EditPayment)
