import React from 'react'
import { render, wait } from '@vtex/test-tools/react'
import MockRouter from 'react-mock-router'
import { act } from 'react-dom/test-utils'

import History from '../components/pages/Details/History'
import { subscriptionHistoryQueryMock as mock } from '../mocks/SubscriptionHistory'
import { generateSubscriptionsGroup, mockRouterParam } from '../mocks'

const copyObj = (o: object) => JSON.parse(JSON.stringify(o))

describe('History Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('should display empty state if no recurrent order exists yet', () =>
    act(async () => {
      const queryMock = copyObj(mock)
      queryMock.result.data.orders.list = []

      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <History group={generateSubscriptionsGroup({})} />
        </MockRouter>,
        { graphql: { mocks: [queryMock] } }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText('There are no orders yet')).toBeTruthy()
      expect(queryByText('Awaiting the first cycle')).toBeTruthy()
    }))

  it('should display all possible states', () =>
    act(async () => {
      const queryMock = copyObj(mock)

      const { queryByText, queryAllByText } = render(
        <MockRouter params={mockRouterParam}>
          <History group={generateSubscriptionsGroup({})} />
        </MockRouter>,
        { graphql: { mocks: [queryMock] } }
      )

      await wait(() => jest.runAllTimers())

      expect(queryAllByText('Processing')).toHaveLength(2)
      expect(
        queryAllByText('A problem has occurred while generating your order')
      ).toHaveLength(2)
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
    }))

  it('should add "isFullyloaded" class to list after loading every item', () =>
    act(async () => {
      const queryMock = copyObj(mock)
      queryMock.result.data.orders.totalCount = 5
      queryMock.result.data.orders.list = queryMock.result.data.orders.list.slice(
        0,
        5
      )

      const { container } = render(
        <MockRouter params={mockRouterParam}>
          <History group={generateSubscriptionsGroup({})} />
        </MockRouter>,
        { graphql: { mocks: [queryMock] } }
      )

      await wait(() => jest.runAllTimers())
      expect(container.querySelector('.isFullyloaded')).toBeTruthy()
    }))
})
