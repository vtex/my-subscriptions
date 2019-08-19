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
            subscriptionId: '611505FD6B4E452E99E2E07B5B90E316',
            sku: {
              skuId: '20',
              name: 'Biscoito para cães',
              productName: 'Biscoito para cães',
              imageUrl:
                'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155391-55-55/doguitos-bifinho-frango-65g.jpg?v=635918401104470000',
              detailUrl: '/biscoitoparacaes/p',
              nameComplete: 'Biscoito para cães',
              __typename: 'vtex_mysubscriptionsgraphql_1_10_0_SKU',
            },
            quantity: 7,
            priceAtSubscriptionDate: 28,
            __typename: 'vtex_mysubscriptionsgraphql_1_10_0_Subscription',
          },
          {
            subscriptionId: '71E17B9AD7D0417583D0A930D68C0DE6',
            sku: {
              skuId: '23',
              name: 'areia de gato hello kitty',
              productName: 'areia de gato hello kitty',
              imageUrl:
                'http://recorrenciaqa.vteximg.com.br/arquivos/ids/155405-55-55/areiadegato.png?v=636032348449970000',
              detailUrl: '/areia-gato-hello-kitty/p',
              nameComplete: 'areia de gato hello kitty',
              __typename: 'vtex_mysubscriptionsgraphql_1_10_0_SKU',
            },
            quantity: 2,
            priceAtSubscriptionDate: 1190,
            __typename: 'vtex_mysubscriptionsgraphql_1_10_0_Subscription',
          },
        ],
        purchaseSettings: {
          currencySymbol: 'BRL',
        },
      },
    },
  },
}
