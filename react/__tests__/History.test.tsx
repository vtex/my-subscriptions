import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import History from '../components/pages/Details/History'
import {
  subscriptionHistoryQueryMock,
  subscriptionGroupMock,
  orderGroupId,
} from '../mocks/SubscriptionHistory'

const copyObj = (o: object) => JSON.parse(JSON.stringify(o))

describe('History Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  test('should display empty state if no recurrent order exists yet', async () => {
    const queryMock = copyObj(subscriptionHistoryQueryMock)
    queryMock.result.data.subscriptionOrdersByGroup.list = []

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: orderGroupId }}>
        <History
          subscriptionsGroup={
            subscriptionGroupMock as SubscriptionsGroupItemType
          }
        />
      </MockRouter>,
      { graphql: { mocks: [queryMock] } }
    )

    await new Promise(res => setTimeout(res))

    expect(queryByText('store/subscription.order.no-order')).toBeTruthy()
    expect(
      queryByText('store/subscription.order.awaiting-first-cycle')
    ).toBeTruthy()
  })

  test('should display all possible states', async () => {
    const queryMock = copyObj(subscriptionHistoryQueryMock)

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: orderGroupId }}>
        <History
          subscriptionsGroup={
            subscriptionGroupMock as SubscriptionsGroupItemType
          }
        />
      </MockRouter>,
      { graphql: { mocks: [queryMock] } }
    )

    await new Promise(res => setTimeout(res))

    expect(
      queryByText('store/subscription.order.status.TRIGGERED')
    ).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.IN_PROCESS')
    ).toBeTruthy()
    expect(queryByText('store/subscription.order.status.FAILURE')).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.ORDER_ERROR')
    ).toBeTruthy()
    expect(queryByText('store/subscription.order.status.SUCCESS')).toBeTruthy()
    expect(queryByText('store/subscription.order.status.EXPIRED')).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.PAYMENT_ERROR')
    ).toBeTruthy()
    expect(queryByText('store/subscription.order.status.SKIPED')).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.SUCCESS_WITH_NO_ORDER')
    ).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.SUCCESS_WITH_PARTIAL_ORDER')
    ).toBeTruthy()
    expect(
      queryByText('store/subscription.order.status.RE_TRIGGERED')
    ).toBeTruthy()
  })

  test('should add "isFullyloaded" class to list after loading every item', async () => {
    const queryMock = copyObj(subscriptionHistoryQueryMock)
    queryMock.result.data.subscriptionOrdersByGroup.totalCount = 5
    queryMock.result.data.subscriptionOrdersByGroup.list = queryMock.result.data.subscriptionOrdersByGroup.list.slice(
      0,
      5
    )

    const { container } = render(
      <MockRouter params={{ orderGroup: orderGroupId }}>
        <History
          subscriptionsGroup={
            subscriptionGroupMock as SubscriptionsGroupItemType
          }
        />
      </MockRouter>,
      { graphql: { mocks: [queryMock] } }
    )

    await new Promise(res => setTimeout(res))
    expect(container.querySelector('.isFullyloaded')).toBeTruthy()
  })
})
