import HISTORY_QUERY from '../graphql/subscriptionOrdersByGroup.gql'

export const orderGroupId = '413D472C39A776B9F2A5E01C435B349E'

export const subscriptionGroupMock = {
  orderGroup: orderGroupId,
}

export const subscriptionHistoryQueryMock = {
  request: {
    query: HISTORY_QUERY,
    variables: {
      page: 1,
      orderGroup: orderGroupId,
      perPage: 5,
    },
  },
  result: {
    data: {
      subscriptionOrdersByGroup: {
        list: [
          {
            subscriptionOrderId: '6923FC5B61A7404B915AF68B29358431',
            status: 'SUCCESS_WITH_PARTIAL_ORDER',
            date: '2019-07-26T09:02:04.9228512Z',
          },
          {
            subscriptionOrderId: '6923FC5B61A7404B915AF68B29358431',
            status: 'SUCCESS',
            date: '2019-07-26T09:02:04.9228512Z',
          },
          {
            subscriptionOrderId: '6923FC5B61A7404B915AF68B29358431',
            status: 'SUCCESS_WITH_NO_ORDER',
            date: '2019-07-26T09:02:04.9228512Z',
          },
          {
            subscriptionOrderId: 'D3D64AB882A14176959FDD9F42D5FF29',
            status: 'RE_TRIGGERED',
            date: '2019-07-12T09:04:28.5884326Z',
          },
          {
            subscriptionOrderId: 'D3D64AB882A14176959FDD9F42D5FF29',
            status: 'PAYMENT_ERROR',
            date: '2019-07-12T09:04:28.5884326Z',
          },
          {
            subscriptionOrderId: 'D3D64AB882A14176959FDD9F42D5FF29',
            status: 'EXPIRED',
            date: '2019-07-12T09:04:28.5884326Z',
          },
          {
            subscriptionOrderId: 'D64CBB427C3D4893A227E6FE0D01BC28',
            status: 'SKIPED',
            date: '2019-06-14T09:02:23.8312392Z',
          },
          {
            subscriptionOrderId: 'DCC7723472D04F2C81610BEB09B08EE0',
            status: 'ORDER_ERROR',
            date: '2019-05-17T09:04:10.9640116Z',
          },
          {
            subscriptionOrderId: '108A7FA484434154BE074F59EDE6D00C',
            status: 'FAILURE',
            date: '2019-05-03T09:03:34.1891959Z',
          },
          {
            subscriptionOrderId: '4971794CDAE4422B8A027EF3E26EC1F5',
            status: 'IN_PROCESS',
            date: '2019-04-19T09:02:47.1350037Z',
          },
          {
            subscriptionOrderId: '7987E7E01FD34C11832EFF579C35322D',
            status: 'TRIGGERED',
            date: '2019-03-22T09:00:46.1130887Z',
          },
        ],
        totalCount: 11,
      },
    },
  },
}
