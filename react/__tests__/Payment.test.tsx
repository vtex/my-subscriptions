import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatus } from '../constants'
import { orderGroup, generateDetailMock } from '../mocks'

const INVALID_PAYMENT =
  'Invalid payment method, select a new valid payment for this subscription.'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    // @ts-ignore
  })

  afterAll(() => {
    window.location = location
  })

  test('Shouldnt display payment error', async () => {
    const { queryByText } = render(
      <MockRouter params={{ subscriptionsGroupId: orderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock()] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeFalsy()
  })

  test('Should display payment error', async () => {
    const { queryByText } = render(
      <MockRouter params={{ subscriptionsGroupId: orderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: { mocks: [generateDetailMock({ hasPaymentMethod: false })] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeTruthy()
  })

  test('Should display payment no-action error when the subscription status is not active', async () => {
    const { queryByText } = render(
      <MockRouter params={{ subscriptionsGroupId: orderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              hasPaymentMethod: false,
              status: SubscriptionStatus.Paused,
            }),
          ],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText('The selected payment method is not available anymore.')
    ).toBeTruthy()
  })
})
