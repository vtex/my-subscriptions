import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, FormattedMessage } from 'react-intl'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { branch, compose, renderComponent } from 'recompose'
import { graphql } from 'react-apollo'
import { Button, Dropdown, Radio } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'
import { PaymentMethod, PaymentSystemGroup } from 'vtex.subscriptions-graphql'

import { TagTypeEnum, CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import CUSTOMER_PAYMENTS from '../../../../graphql/customerPaymentMethods.gql'
import EditionButtons from '../EditionButtons'
import PaymentSkeleton from './PaymentSkeleton'

const CREDIT_CARD: PaymentSystemGroup = 'creditCard'

function cardOptions(
  creditCards: PaymentMethod[],
  intl: WrappedComponentProps['intl']
) {
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
  onChangeCard,
  onCloseAlert,
  accountId,
  paymentSystemGroup,
  showAlert,
  errorMessage,
  intl,
  history,
  methods,
}) => {
  const groupedPayments = methods.reduce<GroupedMethods>((groups, method) => {
    const group = method.paymentSystemGroup

    if (groups[group]) {
      groups[group].push(method)
    } else {
      groups[group] = [method]
    }

    return { ...groups }
  }, {} as GroupedMethods)

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
              value={groupedPayments[group][0].paymentSystemId}
            />
            {groupedPayments[group][0].paymentSystemGroup === CREDIT_CARD && (
              <div className="flex ml6">
                <div className="w-50 mr4">
                  <Dropdown
                    options={cardOptions(groupedPayments.creditCard, intl)}
                    placeholder={intl.formatMessage({
                      id: 'subscription.payment.chooseOne',
                    })}
                    disabled={paymentSystemGroup !== CREDIT_CARD}
                    value={accountId}
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
          disabled={paymentSystemGroup === CREDIT_CARD && !accountId}
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
  onChangeCard: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onChangePayment: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onCloseAlert: () => void
  isLoading: boolean
  paymentSystemGroup: string | null
  accountId: string | null
  showAlert: boolean
  errorMessage: string
}

interface InnerProps
  extends WrappedComponentProps,
    RouteComponentProps,
    ChildProps {}

interface GroupedMethods {
  [key: string]: PaymentMethod[]
}

type Props = InnerProps & OuterProps

export default compose<Props, OuterProps>(
  injectIntl,
  withRouter,
  graphql<{}, { methods: PaymentMethod[] }, {}, ChildProps>(CUSTOMER_PAYMENTS, {
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      methods: data?.methods ?? [],
    }),
  }),
  branch<ChildProps>(({ loading }) => loading, renderComponent(PaymentSkeleton))
)(EditPayment)
