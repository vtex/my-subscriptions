import React from 'react'
import { render, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { mockRouterParam, generateDetailMock } from '../mocks'

const RETRY_BUTTON = 'Try again'

describe('Retry Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('Should display retry', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [
              generateDetailMock({
                lastOrderStatus: 'PAYMENT_ERROR',
              }),
            ],
          },
        }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(RETRY_BUTTON)).toBeTruthy()
    }))

  it('Shouldnt display retry', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [generateDetailMock()],
          },
        }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(RETRY_BUTTON)).toBeFalsy()
    }))
})
