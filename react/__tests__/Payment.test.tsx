import React from 'react'
import MockRouter from 'react-mock-router'
import { render, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'

import SubscriptionDetails from '../components/pages/Details'
import { mockRouterParam, generateDetailMock } from '../mocks'

const INVALID_PAYMENT =
  'Invalid payment method, select a new valid payment for this subscription.'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('Shouldnt display payment error', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: { mocks: [generateDetailMock()] },
        }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(INVALID_PAYMENT)).toBeFalsy()
    }))

  it('Should display payment error', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: { mocks: [generateDetailMock({ hasPaymentMethod: false })] },
        }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(INVALID_PAYMENT)).toBeTruthy()
    }))

  it('Should display payment no-action error when the subscription status is not active', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
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

      await wait(() => jest.runAllTimers())

      expect(
        queryByText('The selected payment method is not available anymore.')
      ).toBeTruthy()
    }))
})
