import QUERY from '../graphql/groupedSubscription.gql'

export const orderGroupId = 'C842CBFAF3728E8EBDA401836B2ED6D1'

export default {
  request: {
    query: QUERY,
    variables: { orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1' },
  },
  result: {
    data: {
      groupedSubscription: {
        cacheId: 'C842CBFAF3728E8EBDA401836B2ED6D1',
        orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
        status: 'ACTIVE',
        isSkipped: false,
        name: null,
        subscriptions: [
          {
            SubscriptionId: '0A19A86877B04D149D314D7453F5385C',
            sku: {
              SkuId: '18',
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
        shippingAddress: {
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
        nextPurchaseDate: '2019-07-10T09:00:57Z',
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
        instances: [
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-06-10T09:04:10.9944376Z',
            dataInstanceId: '3748EAF9A6F44F72B899359C92DF6C81',
            workflowId: '6F72F825EB4D4773899BEDF4150D3AD7',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-05-10T09:01:46.5919998Z',
            dataInstanceId: '0D0773CD17B14F5F9D2167347D2CA84A',
            workflowId: 'DFB5D4DF33174E5C907A5365EE0ED0E4',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-04-10T09:03:29.5027173Z',
            dataInstanceId: '88CA51F4FB7C4D6DB508151C6936C0A3',
            workflowId: '0B4FF9C8D4914969A2837044DB0A19E1',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-03-10T09:00:59.6090489Z',
            dataInstanceId: '50D0F92952504DA3B7DB3DCEB64E33C0',
            workflowId: 'D22B255881AE40DE8B9168A59E90A362',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-02-10T09:01:07.8652644Z',
            dataInstanceId: 'B84ABEC137A64C7D8A1E4D7E74C840DE',
            workflowId: '3447A1317AE84A788AF270A30FC23763',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
          {
            status: 'IN_PROCESS',
            orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
            date: '2019-01-10T09:00:13.5836994Z',
            dataInstanceId: '018D5CF59E71478FB034427FABDEDAEC',
            workflowId: '6667298AEBB14C2B8CAD48441C62B3A6',
            customerName: 'clara szwarcman',
            customerEmail: 'clara@vtex.com.br',
            message: null,
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
        ],
        lastInstance: {
          status: 'PAYMENT_ERROR',
          orderGroup: 'C842CBFAF3728E8EBDA401836B2ED6D1',
          date: '2019-06-10T09:04:10.9944376Z',
          dataInstanceId: '3748EAF9A6F44F72B899359C92DF6C81',
          workflowId: '6F72F825EB4D4773899BEDF4150D3AD7',
          customerName: 'clara szwarcman',
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
          estimatedDeliveryDate: '2019-07-16T00:00:00Z',
        },
      },
    },
  },
}
