import qs from 'query-string'
import { RouteComponentProps } from 'vtex.my-account-commons/Router'

export type EditOptions = 'payment' | 'address'

type Location = RouteComponentProps['location']

function removeElementsFromSearch(elements: string[], location: Location) {
  const parsed = qs.parse(location.search)

  elements.forEach((elementName) => delete parsed[elementName])

  return qs.stringify(parsed)
}

export function getAddressArgs(location: Location) {
  const args = qs.parse(location.search)

  if (args.newAddressId) {
    return {
      id: args.newAddressId as string,
      type: (args.newAddressType ?? 'residential') as string,
    }
  }

  return null
}

export function getPaymentArgs(location: Location) {
  const args = qs.parse(location.search)

  if (args.newPaymentSystemId && args.newPaymentAccountId) {
    return {
      paymentAccountId: args.newPaymentAccountId as string,
      paymentSystemId: args.newPaymentSystemId as string,
    }
  }

  return null
}

export function removeArgs(location: Location) {
  return removeElementsFromSearch(
    [
      'newPaymentAccountId',
      'newPaymentSystemId',
      'newAddressId',
      'newAddressType',
    ],
    location
  )
}
