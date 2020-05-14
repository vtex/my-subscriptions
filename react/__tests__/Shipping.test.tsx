import React from 'react'
import { render, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { mockRouterParam, generateDetailMock } from '../mocks'

const ERROR_MESSAGE =
  'Invalid address, select a new valid address for this subscription.'

describe('Shipping Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('Shouldnt display address error', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        { graphql: { mocks: [generateDetailMock()] } }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(ERROR_MESSAGE)).toBeFalsy()
    }))

  it('Should display address error', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [generateDetailMock({ hasShippingAddress: false })],
          },
        }
      )

      await wait(() => jest.runAllTimers())

      expect(queryByText(ERROR_MESSAGE)).toBeTruthy()
    }))

  it('Should display address no-action error when the subscription status is not active', () =>
    act(async () => {
      const { queryByText } = render(
        <MockRouter params={mockRouterParam}>
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

      await wait(() => jest.runAllTimers())

      expect(
        queryByText('The selected address is not available anymore.')
      ).toBeTruthy()
    }))
})
