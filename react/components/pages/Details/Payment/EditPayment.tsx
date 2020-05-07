import React, { FunctionComponent } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  InjectedIntl,
} from 'react-intl'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { branch, compose, renderComponent } from 'recompose'
import { graphql } from 'react-apollo'
import { groupBy } from 'ramda'
import { Button, Dropdown, Radio } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'
import { PaymentMethod } from 'vtex.subscriptions-graphql'

import {
  PaymentSystemGroup,
  TagTypeEnum,
  CSS,
  BASIC_CARD_WRAPPER,
} from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import CUSTOMER_PAYMENTS from '../../../../graphql/customerPaymentMethods.gql'
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
      value: paymentAccount && paymentAccount.id,
    })
  )
}

function getCreditCard(accountId: string, cards: PaymentMethod[]): PaymentMethod{
  // eslint-disable-next-line prettier/prettier
  return cards.find((card) => card.paymentAccount?.id === accountId) as PaymentMethod
}

function goToCreateCard(history: RouteComponentProps['history']) {
  const here = history.location.pathname

  history.push({
    pathname: '/cards/new',
    search: `?returnUrl=${here}`,
  })
}

const EditPayment: FunctionComponent<Props> = ({
  isLoading,
  onCancel,
  onSave,
  onChangePayment,
  onChangePaymentGroup,
  onCloseAlert,
  accountId,
  paymentSystemGroup,
  showAlert,
  errorMessage,
  intl,
  history,
  methods,
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
              onChange={() => {
                const selectedGroup: PaymentSystemGroup = group as PaymentSystemGroup

                if(selectedGroup === PaymentSystemGroup.CreditCard) {
                  onChangePaymentGroup(group as PaymentSystemGroup)
                } else {
                  const selectedSystemId = groupedPayments[group][0].paymentSystemId
                  onChangePaymentGroup(selectedGroup, selectedSystemId)
                }
              }}
              value={group}
            />
            {group === PaymentSystemGroup.CreditCard && (
              <div className="flex ml6">
                <div className="w-50 mr4">
                  <Dropdown
                    options={cardOptions(groupedPayments.creditCard, intl)}
                    placeholder={intl.formatMessage({
                      id: 'subscription.payment.chooseOne',
                    })}
                    disabled={
                      paymentSystemGroup !== PaymentSystemGroup.CreditCard
                    }
                    value={accountId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedAccount = e.target.value

                        const card = getCreditCard(selectedAccount, groupedPayments.creditCard)

                        onChangePayment(card.paymentSystemId, selectedAccount)
                    } }
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
            paymentSystemGroup === PaymentSystemGroup.CreditCard && !accountId
          }
        />
      </div>
    </div>
  )
}

interface ChildProps {
  loading: boolean
  methods: PaymentMethod[]
}

interface OuterProps {
  onSave: () => void
  onCancel: () => void
  onChangePayment: (paymentSystemId: string, accountId?: string) => void
  onChangePaymentGroup: (paymentGroup: PaymentSystemGroup, paymentSystemId?: string) => void
  onCloseAlert: () => void
  isLoading: boolean
  paymentSystemGroup: PaymentSystemGroup | null
  accountId: string | null
  showAlert: boolean
  errorMessage: string
}

interface InnerProps
  extends InjectedIntlProps,
    RouteComponentProps,
    ChildProps {}

type Props = InnerProps & OuterProps

export default compose<Props, OuterProps>(
  injectIntl,
  withRouter,
  graphql<{}, { methods: PaymentMethod[] }, {}, ChildProps>(CUSTOMER_PAYMENTS, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      methods: (data && data.methods) || [],
    }),
  }),
  branch<ChildProps>(({ loading }) => loading, renderComponent(PaymentSkeleton))
)(EditPayment)
