import React, { FunctionComponent } from 'react'
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  InjectedIntl,
  defineMessages,
} from 'react-intl'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { branch, compose, renderComponent } from 'recompose'
// eslint-disable-next-line no-restricted-imports
import { groupBy } from 'ramda'
import { Button, Dropdown, Radio, Alert } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'
import { PaymentMethod } from 'vtex.subscriptions-graphql'

import { PaymentSystemGroup } from '../../../constants'
import CUSTOMER_PAYMENTS from '../../../graphql/customerPaymentMethods.gql'
import EditionButtons from '../EditionButtons'
import PaymentSkeleton from './PaymentSkeleton'
import { queryWrapper } from '../../../tracking'

function cardOptions(creditCards: PaymentMethod[], intl: InjectedIntl) {
  return creditCards.map(
    ({ paymentSystemGroup, paymentSystemName, paymentAccount }) => ({
      label: utils.displayPayment({
        intl,
        paymentSystemGroup,
        paymentSystemName,
        lastDigits: paymentAccount?.cardNumber.slice(-4),
      }),
      value: paymentAccount?.id,
    })
  )
}

function getCreditCard(
  accountId: string,
  cards: PaymentMethod[]
): PaymentMethod {
  return cards.find((card) => {
    const id = card.paymentAccount ? card.paymentAccount.id : null

    return id === accountId
  }) as PaymentMethod
}

function goToCreateCard(history: RouteComponentProps['history']) {
  const here = history.location.pathname

  history.push({
    pathname: '/cards/new',
    search: `?returnUrl=${here}`,
  })
}

const INSTANCE = 'SubscriptionsDetails/CustomerPaymentMethods'

const messages = defineMessages({
  chooseOne: {
    id: 'store/subscription.payment.chooseOne',
    defaultMessage: '',
  },
})

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
    <>
      <div className="db-s di-ns b f4 tl c-on-base">
        <FormattedMessage id="store/subscription.payment" />
      </div>
      <div className="flex flex-column justify-center mt5">
        {showAlert && (
          <div className="mb5">
            <Alert type="error" onClose={onCloseAlert}>
              {errorMessage}
            </Alert>
          </div>
        )}
        {Object.keys(groupedPayments).map((group) => (
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

                if (selectedGroup === PaymentSystemGroup.CreditCard) {
                  onChangePaymentGroup(group as PaymentSystemGroup)
                } else {
                  const selectedSystemId =
                    groupedPayments[group][0].paymentSystemId
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
                    placeholder={intl.formatMessage(messages.chooseOne)}
                    disabled={
                      paymentSystemGroup !== PaymentSystemGroup.CreditCard
                    }
                    value={accountId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const selectedAccount = e.target.value

                      const card = getCreditCard(
                        selectedAccount,
                        groupedPayments.creditCard
                      )

                      onChangePayment(card.paymentSystemId, selectedAccount)
                    }}
                  />
                </div>
                <Button
                  variation="tertiary"
                  size="small"
                  onClick={() => goToCreateCard(history)}
                >
                  <FormattedMessage id="store/subcription.add.new.card" />
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
    </>
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
  onChangePaymentGroup: (
    paymentGroup: PaymentSystemGroup,
    paymentSystemId?: string
  ) => void
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
  queryWrapper<{}, { methods: PaymentMethod[] }, {}, ChildProps>(
    INSTANCE,
    CUSTOMER_PAYMENTS,
    {
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        methods: data?.methods ?? [],
      }),
    }
  ),
  branch<ChildProps>(({ loading }) => loading, renderComponent(PaymentSkeleton))
)(EditPayment)
