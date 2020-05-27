import React from 'react'
import { render } from '@vtex/test-tools/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/Details'
import { MOCK_ROUTER_PARAM, generateDetailMock } from '../mocks'

const INVALID_PAYMENT =
  'Invalid payment method, select a new valid payment for this subscription.'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  it('Shouldnt display payment error', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock()] },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeFalsy()
  })

  it('Should display payment error', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock({ hasPaymentMethod: false })] },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeTruthy()
  })

  it('Should display payment no-action error when the subscription status is not active', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              hasPaymentMethod: false,
              status: 'PAUSED',
            }),
          ],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(
      queryByText('The selected payment method is not available anymore.')
    ).toBeTruthy()
  })
})
