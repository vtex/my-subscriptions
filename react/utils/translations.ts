import { InjectedIntl } from 'react-intl'

type Periodicity = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export function translatePeriodicity(
  intl: InjectedIntl,
  periodicity: Periodicity,
  interval: number
) {
  return intl.formatMessage(
    { id: `order.subscription.periodicity.${periodicity.toLowerCase()}` },
    { count: interval }
  )
}

export function translatePurchaseDay(
  intl: InjectedIntl,
  periodicity: Periodicity,
  purchaseDay?: string
) {
  if (
    purchaseDay &&
    periodicity !== 'DAILY' &&
    purchaseDay !== 'Not_Applicable'
  ) {
    let moment = purchaseDay.toLowerCase()

    if (periodicity === 'WEEKLY') {
      moment = intl
        .formatMessage({ id: `subscription.periodicity.${moment}` })
        .toLocaleLowerCase()

      return intl.formatMessage(
        {
          id: `order.subscription.periodicity.${periodicity.toLowerCase()}.step`,
        },
        { moment }
      )
    }
  }

  return ''
}
