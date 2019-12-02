import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { mockRouterParam, generateDetailMock } from '../mocks'
import { SubscriptionOrderStatus } from '../constants'

const RETRY_BUTTON = 'Try again'

describe('Retry Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    // @ts-ignore
  })

  afterAll(() => {
    window.location = location
  })

  test('Should display retry', async () => {
    const { queryByText } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              lastOrderStatus: SubscriptionOrderStatus.PaymentError,
            }),
          ],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(RETRY_BUTTON)).toBeTruthy()
  })

  test('Shouldnt display retry', async () => {
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

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(RETRY_BUTTON)).toBeFalsy()
  })
})
