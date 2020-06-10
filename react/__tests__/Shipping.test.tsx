import React from 'react'
import { render } from '@vtex/test-tools/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/Details'
import { MOCK_ROUTER_PARAM, generateDetailMock } from '../mocks'

const ERROR_MESSAGE =
  'Invalid address, select a new valid address for this subscription.'

describe('Shipping Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  it('Shouldnt display address error', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      { graphql: { mocks: [generateDetailMock()] } }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeFalsy()
  })

  it('Should display address error', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock({ hasShippingAddress: false })] },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeTruthy()
  })

  it('Should display address no-action error when the subscription status is not active', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              hasShippingAddress: false,
              status: 'PAUSED',
            }),
          ],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(
      queryByText('The selected address is not available anymore.')
    ).toBeTruthy()
  })
})
