import {
  SubscriptionStatus,
  SubscriptionExecutionStatus,
  Plan,
} from 'vtex.subscriptions-graphql'

import { Subscription } from '../graphql/queries/subscription.gql'

function generateItems(itemsAmount: number): Subscription['items'] {
  const items = []
  for (let i = 0; i < itemsAmount; i++) {
    items.push({
      id: `0A19A86877B04D149D314D7453F538${i}C`,
      sku: {
        id: `1${i}`,
        name: 'Ração para peixe',
        brandName: 'test',
        productName: 'Ração para peixe',
        imageUrl:
          'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155392-55-55/AlconKOI.jpg?v=635918402228600000',
        detailUrl: '/racaoparapeixe/p',
        variations: null,
        measurementUnit: 'un',
        unitMultiplier: 1,
      },
      quantity: 1,
      currentPrice: 100,
    })
  }

  return items
}

const PLAN: Plan = {
  id: 'vtex.subscription.basic',
  frequency: {
    periodicity: 'MONTHLY',
    interval: 1,
  },
  purchaseDay: '10',
}

export const DEFAULT_SUBSCRIPTION_ID = 'C842CBFAF3728E8EBDA401836B2ED6D1'

export interface GenerationArgs {
  subscriptionId?: string
  status?: SubscriptionStatus
  numberOfItems?: number
  nextPurchaseDate?: string
  estimatedDeliveryDate?: string
  hasPaymentMethod?: boolean
  hasShippingAddress?: boolean
  lastExecutionStatus?: SubscriptionExecutionStatus
  name?: string
}

export function generateSubscription({
  status = 'ACTIVE',
  subscriptionId = DEFAULT_SUBSCRIPTION_ID,
  numberOfItems = 1,
  nextPurchaseDate = '2019-07-10T09:00:57Z',
  estimatedDeliveryDate = '2019-07-16T00:00:00Z',
  hasPaymentMethod = true,
  hasShippingAddress = true,
  lastExecutionStatus = 'IN_PROCESS',
  name,
}: GenerationArgs): Subscription {
  const items = generateItems(numberOfItems)

  return {
    __typename: 'Subscription',
    id: subscriptionId,
    cacheId: subscriptionId,
    status,
    isSkipped: false,
    name: name ?? null,
    items,
    plan: PLAN,
    shippingAddress: hasShippingAddress
      ? {
          id: 'b3665b68c9714441bdea54c35a4d0cd6',
          street: 'Avenida Evandro Lins e Silva',
          number: '1',
          complement: null,
          neighborhood: 'Barra da Tijuca',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'BRA',
          postalCode: '22631-470',
          reference: null,
          geoCoordinate: null,
          receiverName: 'clara szwarcman',
          addressType: 'residential',
        }
      : null,
    purchaseSettings: {
      paymentMethod: hasPaymentMethod
        ? {
            paymentSystemId: '2',
            paymentSystemName: 'Visa',
            paymentSystemGroup: 'creditCard',
            paymentAccount: {
              id: '5FE0FD2838AB47BF852E9E43402DE553',
              cardNumber: '************1111',
              bin: '',
            },
          }
        : null,
      currencyCode: 'BRL',
    },
    nextPurchaseDate,
    totals: [
      {
        id: 'Items',
        value: 100,
      },
      {
        id: 'Shipping',
        value: 300,
      },
    ],
    lastExecution: {
      id: '3748EAF9A6F44F72B899359C92DF6C81',
      status: lastExecutionStatus,
    },
    estimatedDeliveryDate,
    addressId: 'b3665b68c9714441bdea54c35a4d0cd6',
    paymentAccountId: null,
  }
}
