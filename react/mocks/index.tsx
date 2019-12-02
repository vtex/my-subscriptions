import {
  SubscriptionStatus,
  SubscriptionOrderStatus,
  PaymentSystemGroup,
  Periodicity,
} from '../constants'

export const orderGroup = 'C842CBFAF3728E8EBDA401836B2ED6D1'

const plan = {
  frequency: {
    periodicity: Periodicity.Monthly,
    interval: 1,
  },
  validity: {
    begin: '2018-12-10T00:00:00Z',
    end: '2021-12-10T00:00:00Z',
  },
  type: 'RECURRING_PAYMENT',
}

function generateSubscriptions(subscriptionsAmount: number) {
  const subscriptions = []
  for (let i = 0; i < subscriptionsAmount; i++) {
    subscriptions.push({
      id: `0A19A86877B04D149D314D7453F538${i}C`,
      sku: {
        id: `1${i}`,
        name: 'Ração para peixe',
        productName: 'Ração para peixe',
        imageUrl:
          'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155392-55-55/AlconKOI.jpg?v=635918402228600000',
        detailUrl: '/racaoparapeixe/p',
        nameComplete: 'Ração para peixe',
        variations: null,
        measurementUnit: 'un',
      },
      quantity: 1,
      priceAtSubscriptionDate: 100,
    })
  }

  return subscriptions
}

export function generateSubscriptionsGroup({
  subscriptionsGroupId = orderGroup,
  status = SubscriptionStatus.Active,
  subscriptionsAmount = 1,
  nextPurchaseDate = '2019-07-10T09:00:57Z',
  estimatedDeliveryDate = '2019-07-16T00:00:00Z',
}) {
  return {
    id: subscriptionsGroupId,
    cacheId: subscriptionsGroupId,
    status: status,
    isSkipped: false,
    name: null,
    subscriptions: generateSubscriptions(subscriptionsAmount),
    plan,
    shippingAddress: {
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
    },
    purchaseSettings: {
      purchaseDay: '10',
      paymentMethod: {
        paymentSystemId: '2',
        paymentSystemName: 'Visa',
        paymentSystemGroup: PaymentSystemGroup.CreditCard,
        paymentAccount: {
          id: '5FE0FD2838AB47BF852E9E43402DE553',
          cardNumber: '************1111',
          bin: '444433',
        },
      },
      currencySymbol: 'BRL',
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
    totalValue: 400,
    lastOrder: {
      id: '3748EAF9A6F44F72B899359C92DF6C81',
      cacheId: '3748EAF9A6F44F72B899359C92DF6C81',
      subscriptionsGroupId,
      status: SubscriptionOrderStatus.InProcess,
      date: '2019-06-10T09:04:10.9944376Z',
      customerName: 'ahsudhausda szwarcman',
      customerEmail: 'clara@vtex.com.br',
      message: 'Checkout failure on gateway callback',
      context: {
        items: [
          {
            skuId: '18',
            name: 'Ração para peixe',
            imageUrl:
              'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155392-55-55/AlconKOI.jpg?v=635918402228600000',
            quantity: 1,
            price: null,
          },
        ],
        plan,
        value: 0,
        paymentSystemName: 'Visa',
      },
    },
    shippingEstimate: {
      estimatedDeliveryDate,
    },
  }
}
