import React, { FunctionComponent } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { Radio, Dropdown, Button } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'
import { PaymentSystemGroup, PaymentMethod } from 'vtex.subscriptions-graphql'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

import {
  groupPayments,
  creditCardOptions,
  getCreditCard,
  goToNReturn,
} from './utils'
import Label from '../LabeledInfo'

const messages = defineMessages({
  select: {
    id: 'store/subscription.select',
  },
  addNew: {
    id: 'store/subcription.add.new.card',
  },
  label: {
    id: 'store/display-payment.label',
  },
})

const PaymentSelector: FunctionComponent<Props> = ({
  payments,
  intl,
  selectedPaymentSystemGroup,
  selectedPaymentAccountId,
  onChangePaymentSystemGroup,
  onChangePaymentAccount,
  history,
}) => {
  const groupedPayments = groupPayments(payments)

  return (
    <Label label={intl.formatMessage(messages.label)} labelDark>
      {Object.keys(groupedPayments).map((group) => (
        <div className="pb4" key={group}>
          <Radio
            id={group}
            label={utils.translatePaymentGroup({
              intl,
              paymentSystemGroup: group,
            })}
            name={group}
            checked={selectedPaymentSystemGroup === group}
            onChange={() => {
              const selectedGroup = group as PaymentSystemGroup

              if (selectedGroup === 'creditCard') {
                onChangePaymentSystemGroup({ group: selectedGroup })
              } else {
                const selectedSystemId =
                  groupedPayments[group][0].paymentSystemId
                onChangePaymentSystemGroup({
                  group: selectedGroup,
                  paymentSystemId: selectedSystemId,
                })
              }
            }}
            value={group}
          />
          {group === 'creditCard' && (
            <div className="ml5">
              <div className="mr2 mb3">
                <Dropdown
                  options={creditCardOptions(groupedPayments.creditCard, intl)}
                  placeholder={intl.formatMessage(messages.select)}
                  disabled={selectedPaymentSystemGroup !== 'creditCard'}
                  value={selectedPaymentAccountId}
                  error={selectedPaymentAccountId === null}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedAccount = e.target.value

                    const card = getCreditCard(
                      selectedAccount,
                      groupedPayments.creditCard
                    )

                    onChangePaymentAccount({
                      paymentSystemId: card.paymentSystemId,
                      paymentAccountId: selectedAccount,
                    })
                  }}
                />
              </div>
              <Button
                variation="tertiary"
                size="small"
                onClick={() => goToNReturn({ history, pathname: '/cards/new' })}
              >
                {intl.formatMessage(messages.addNew)}
              </Button>
            </div>
          )}
        </div>
      ))}
    </Label>
  )
}

type InnerProps = WrappedComponentProps & RouteComponentProps

type OuterProps = {
  payments: PaymentMethod[]
  selectedPaymentSystemGroup: PaymentSystemGroup | null
  selectedPaymentAccountId: string | null
  onChangePaymentAccount: (args: {
    paymentSystemId: string
    paymentAccountId: string
  }) => void
  onChangePaymentSystemGroup: (args: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) => void
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(withRouter, injectIntl)

export default enhance(PaymentSelector)
