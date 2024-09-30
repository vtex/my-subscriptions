import type { FunctionComponent, ReactNode } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { compose } from 'recompose'
import { Radio, Dropdown, Button } from 'vtex.styleguide'
import { utils } from 'vtex.payment-flags'
import type {
  PaymentSystemGroup,
  PaymentMethod,
} from 'vtex.subscriptions-graphql'
import type { RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRouter } from 'vtex.my-account-commons/Router'

import {
  groupPayments,
  creditCardOptions,
  getCreditCard,
  goToNReturn,
} from './utils'
import Label from '../LabeledInfo'

const messages = defineMessages({
  select: {
    id: 'subscription.select',
  },
  addNew: {
    id: 'subcription.add.new.card',
  },
  label: {
    id: 'display-payment.label',
  },
})

const PaymentSelector: FunctionComponent<Props> = ({
  payments,
  intl,
  selectedPaymentSystemGroup,
  selectedPaymentAccountId,
  onChangePaymentSystemGroup,
  onChangePaymentAccount,
  onBlurPaymentAccount,
  history,
  errorMessagePaymentAccount,
}) => {
  const groupedPayments = groupPayments(payments)

  const AddCardButton = (
    <Button
      variation="tertiary"
      size="small"
      onClick={() => goToNReturn({ history, pathname: '/cards/new' })}
    >
      {intl.formatMessage(messages.addNew)}
    </Button>
  )

  const groups = Object.keys(groupedPayments).filter(
    group => group !== 'promissory'
  )

  return (
    <Label label={intl.formatMessage(messages.label)} labelDark>
      {groups.length > 0
        ? groups.map(group => (
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
                      options={creditCardOptions(
                        groupedPayments.creditCard,
                        intl
                      )}
                      placeholder={intl.formatMessage(messages.select)}
                      disabled={selectedPaymentSystemGroup !== 'creditCard'}
                      value={selectedPaymentAccountId}
                      error={selectedPaymentAccountId === null}
                      onBlur={onBlurPaymentAccount}
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
                      errorMessage={errorMessagePaymentAccount}
                    />
                  </div>
                  {AddCardButton}
                </div>
              )}
            </div>
          ))
        : AddCardButton}
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
  onBlurPaymentAccount?: (e: FocusEvent) => void
  onChangePaymentSystemGroup: (args: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) => void
  errorMessagePaymentAccount?: string | ReactNode
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(withRouter, injectIntl)

export default enhance(PaymentSelector)
