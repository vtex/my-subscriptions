import QUERY from '../graphql/products/listSubscriptions.gql'
import { orderGroup } from '.'

export default {
  request: {
    query: QUERY,
    variables: { orderGroup },
  },
  result: {
    data: {
      groupedSubscription: {
        cacheId: orderGroup,
        orderGroup,
        status: 'ACTIVE',
        isSkipped: false,
        name: null,
        subscriptions: [
          {
            subscriptionId: '0A19A86877B04D149D314D7453F5385C',
            sku: {
              skuId: '18',
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
          },
        ],
        purchaseSettings: {
          currencySymbol: 'BRL',
        },
      },
    },
  },
}
