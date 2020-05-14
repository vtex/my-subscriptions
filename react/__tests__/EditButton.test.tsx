import React from 'react'
import MockRouter from 'react-mock-router'
import { render, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'

import SubscriptionDetails from '../components/pages/Details'
import { mockRouterParam, generateDetailMock } from '../mocks'

describe('Display Address Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('Should display edit button disabled', () =>
    act(async () => {
      const { queryByTestId } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [generateDetailMock({ status: 'PAUSED' })],
          },
        }
      )

      await wait(() => jest.runAllTimers())

      const paymentButton = queryByTestId('edit-payment-button')
      const addressButton = queryByTestId('edit-address-button')
      const frequencyButton = queryByTestId('edit-frequency-button')

      expect((paymentButton as any).disabled).toBe(true)
      expect((addressButton as any).disabled).toBe(true)
      expect((frequencyButton as any).disabled).toBe(true)
    }))

  it('Shouldnt display edit button', () =>
    act(async () => {
      const { queryByTestId } = render(
        <MockRouter params={mockRouterParam}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [generateDetailMock({ status: 'CANCELED' })],
          },
        }
      )

      await wait(() => jest.runAllTimers())

      const paymentButton = queryByTestId('edit-payment-button')
      const addressButton = queryByTestId('edit-address-button')
      const frequencyButton = queryByTestId('edit-frequency-button')

      expect(paymentButton).toBeNull()
      expect(addressButton).toBeNull()
      expect(frequencyButton).toBeNull()
    }))
})
