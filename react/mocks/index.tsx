export const orderGroup = 'C842CBFAF3728E8EBDA401836B2ED6D1'

function generateSubscriptions(subscriptionsAmount: number) {
  const subscriptions = []
  for (let i = 0; i < subscriptionsAmount; i++) {
    subscriptions.push({
      SubscriptionId: `0A19A86877B04D149D314D7453F538${i}C`,
      sku: {
        skuId: `1${i}`,
        name: 'Ração para peixe',
        productName: 'Ração para peixe',
        imageUrl:
          'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155392-55-55/AlconKOI.jpg?v=635918402228600000',
        detailUrl: '/racaoparapeixe/p',
        nameComplete: 'Ração para peixe',
      },
      quantity: 1,
      priceAtSubscriptionDate: 100,
      cycleCount: 6,
      status: 'ACTIVE',
      createdAt: '2018-12-10T15:53:19.5498596Z',
      lastUpdate: '2019-06-13T14:55:55.3805327Z',
      originalOrderId: '882483179243-01',
      isSkipped: false,
    })
  }

  return subscriptions
}

export function generateSubscriptionsGroup({
  subscriptionsGroupId = orderGroup,
  status = 'ACTIVE',
  subscriptionsAmount = 1,
  nextPurchaseDate = '2019-07-10T09:00:57Z',
  estimatedDeliveryDate = '2019-07-16T00:00:00Z',
}) {
  return {
    cacheId: subscriptionsGroupId,
    orderGroup: subscriptionsGroupId,
    status: status,
    isSkipped: false,
    name: null,
    subscriptions: generateSubscriptions(subscriptionsAmount),
    plan: {
      frequency: {
        periodicity: 'MONTHLY',
        interval: 1,
      },
      validity: {
        begin: '2018-12-10T00:00:00Z',
        end: '2021-12-10T00:00:00Z',
      },
      type: 'RECURRING_PAYMENT',
    },
    shippingAddress: {
      cacheId: 'b3665b68c9714441bdea54c35a4d0cd6',
      addressId: 'b3665b68c9714441bdea54c35a4d0cd6',
      street: 'Avenida Evandro Lins e Silva',
      number: '1',
      complement: null,
      neighborhood: 'Barra da Tijuca',
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'BRA',
      postalCode: '22631-470',
      reference: null,
      formattedAddress: null,
      additionalComponents: null,
      geoCoordinate: null,
      receiverName: 'clara szwarcman',
      addressType: 'residential',
    },
    purchaseSettings: {
      purchaseDay: '10',
      cacheId: '5FE0FD2838AB47BF852E9E43402DE553',
      paymentMethod: {
        paymentSystem: '2',
        paymentSystemName: 'Visa',
        paymentSystemGroup: 'creditCard',
        paymentAccount: {
          accountId: '5FE0FD2838AB47BF852E9E43402DE553',
          cardNumber: '************1111',
          bin: '444433',
        },
      },
      seller: '1',
      salesChannel: '1',
      currencySymbol: 'BRL',
      cycleCount: 6,
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
    lastInstance: {
      status: 'IN_PROCESS',
      orderGroup: subscriptionsGroupId,
      date: '2019-06-10T09:04:10.9944376Z',
      dataInstanceId: '3748EAF9A6F44F72B899359C92DF6C81',
      workflowId: '6F72F825EB4D4773899BEDF4150D3AD7',
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
            isGift: false,
          },
        ],
        plan: {
          frequency: {
            periodicity: 'MONTHLY',
            interval: 1,
          },
          validity: {
            begin: '2018-12-10T00:00:00Z',
            end: '2021-12-10T00:00:00Z',
          },
          type: 'RECURRING_PAYMENT',
        },
        value: 0,
        paymentSystemName: 'Visa',
      },
    },
    shippingEstimate: {
      estimatedDeliveryDate,
    },
  }
}
