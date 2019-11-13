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

    expect(queryByText('There are no orders yet')).toBeTruthy()
    expect(queryByText('Awaiting the first cycle')).toBeTruthy()
  })

  test('should display all possible states', async () => {
    const queryMock = copyObj(subscriptionHistoryQueryMock)

    const { queryByText, queryAllByText } = render(
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

    expect(queryAllByText('Processing').length).toBe(2)
    expect(
      queryAllByText('A problem has occurred while generating your order')
        .length
    ).toBe(2)
    expect(queryByText('Order successfully generated')).toBeTruthy()
    expect(queryByText('Subscription expired')).toBeTruthy()
    expect(queryByText('Payment Error')).toBeTruthy()
    expect(queryByText('Skipped cycle')).toBeTruthy()
    expect(
      queryByText(
        "We tried to generate your order, but the products weren't in stock"
      )
    ).toBeTruthy()
    expect(
      queryByText(
        "We're able to generate your order, but one or more items weren't in stock"
      )
    ).toBeTruthy()
    expect(
      queryByText(
        "After an unsuccessful attempt, we're trying to generate your order again"
      )
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
