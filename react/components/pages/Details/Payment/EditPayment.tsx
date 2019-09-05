import React, { FunctionComponent } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  InjectedIntl,
} from 'react-intl'
import { withRouter } from 'react-router-dom'
import { branch, compose, renderComponent } from 'recompose'
import { graphql } from 'react-apollo'
import { groupBy } from 'ramda'
import { Button, Dropdown, Radio } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'

import {
  PaymentGroupEnum,
  TagTypeEnum,
  CSS,
  BASIC_CARD_WRAPPER,
} from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import QUERY from '../../../../graphql/payments/paymentMethods.gql'
import EditionButtons from '../EditionButtons'
import PaymentSkeleton from './PaymentSkeleton'

function cardOptions(creditCards: PaymentMethod[], intl: InjectedIntl) {
  return creditCards.map(
    ({ paymentSystemGroup, paymentSystemName, paymentAccount }) => ({
      label: utils.displayPayment({
        intl,
        paymentSystemGroup,
        paymentSystemName,
        lastDigits: paymentAccount && paymentAccount.cardNumber.slice(-4),
      }),
      value: paymentAccount && paymentAccount.accountId,
    })
  )
}

function goToCreateCard(history: any) {
  const here = history.location.pathname

  history.push({
    pathname: '/cards/new',
    search: `?returnUrl=${here}`,
  })
}

const EditPayment: FunctionComponent<InnerProps & OuterProps> = ({
  data: { methods },
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
    (method: PaymentMethod) => method.paymentSystemGroup
  )(methods)

  if (methods.length === 0) goToCreateCard(history)

  return (
    <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="subscription.payment" />
      </div>
      <div className="flex flex-column justify-center mt5">
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
              label={utils.translatePaymentGroup({
                intl,
                paymentSystemGroup: group,
              })}
              name={group}
              checked={paymentSystemGroup === group}
              onChange={onChangePayment}
              value={groupedPayments[group][0].paymentSystem}
            />
            {groupedPayments[group][0].paymentSystemGroup ===
              PaymentGroupEnum.CreditCard && (
              <div className="flex ml6">
                <div className="w-50 mr4">
                  <Dropdown
                    options={cardOptions(groupedPayments.creditCard, intl)}
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
                  <FormattedMessage id="subcription.add.new.card" />
                </Button>
              </div>
            )}
          </div>
        ))}
        <EditionButtons
          isLoading={isLoading}
          onCancel={onCancel}
          onSave={onSave}
          disabled={
            paymentSystemGroup === PaymentGroupEnum.CreditCard && !account
          }
        />
      </div>
    </div>
  )
}

interface QueryResults {
  loading: boolean
  methods: PaymentMethod[]
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
  data: QueryResults
  history: any
}

export default compose<InnerProps & OuterProps, OuterProps>(
  injectIntl,
  withRouter,
  graphql(QUERY),
  branch(
    ({ data: { loading } }: InnerProps) => loading,
    renderComponent(PaymentSkeleton)
  )
)(EditPayment)
