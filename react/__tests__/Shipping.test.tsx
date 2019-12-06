import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatus } from '../constants'
import { mockRouterParam, generateDetailMock } from '../mocks'

const ERROR_MESSAGE =
  'Invalid address, select a new valid address for this subscription.'

describe('Shipping Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    // @ts-ignore
  })

  afterAll(() => {
    window.location = location
  })

  test('Shouldnt display address error', async () => {
    const { queryByText } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      { graphql: { mocks: [generateDetailMock()] } }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeFalsy()
  })

  test('Should display address error', async () => {
    const { queryByText } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock({ hasShippingAddress: false })] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeTruthy()
  })

  test('Should display address no-action error when the subscription status is not active', async () => {
    const { queryByText } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              hasShippingAddress: false,
              status: SubscriptionStatus.Paused,
            }),
          ],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText('The selected address is not available anymore.')
    ).toBeTruthy()
  })
})
