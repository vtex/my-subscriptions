import { IntlShape } from 'react-intl'
import { RouteComponentProps } from 'vtex.my-account-commons/Router'
import { PaymentMethod } from 'vtex.subscriptions-graphql'
import { utils } from 'vtex.payment-flags'

export function goToNReturn({
  history,
  pathname,
}: {
  history: RouteComponentProps['history']
  pathname: string
}) {
  history.push({
    pathname,
    search: `?returnUrl=${history.location.pathname}`,
  })
}

type GroupedPayments = {
  [index: string]: PaymentMethod[]
}

export function groupPayments(payments: PaymentMethod[]): GroupedPayments {
  return payments.reduce<GroupedPayments>((prev, current) => {
    if (prev[current.paymentSystemGroup as string]) {
      return {
        ...prev,
        [current.paymentSystemGroup]: [
          ...prev[current.paymentSystemGroup],
          current,
        ],
      }
    }
    return {
      ...prev,
      [current.paymentSystemGroup]: [current],
    }
  }, {})
}

export function creditCardOptions(
  creditCards: PaymentMethod[],
  intl: IntlShape
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
export function getCreditCard(
  accountId: string,
  cards: PaymentMethod[]
): PaymentMethod {
  return cards.find((card) => {
    const id = card.paymentAccount ? card.paymentAccount.id : null

    return id === accountId
  }) as PaymentMethod
}
