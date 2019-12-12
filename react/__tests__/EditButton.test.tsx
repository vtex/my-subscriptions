import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatus } from '../constants'
import { mockRouterParam, generateDetailMock } from '../mocks'

describe('Display Address Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    // @ts-ignore
  })

  afterAll(() => {
    window.location = location
  })

  test('Should display edit button disabled', async () => {
    const { queryByTestId } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [generateDetailMock({ status: SubscriptionStatus.Paused })],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    const paymentButton = queryByTestId('edit-payment-button')
    const addressButton = queryByTestId('edit-address-button')
    const frequencyButton = queryByTestId('edit-frequency-button')

    expect((paymentButton as any).disabled).toBe(true)
    expect((addressButton as any).disabled).toBe(true)
    expect((frequencyButton as any).disabled).toBe(true)
  })

  test('Shouldnt display edit button', async () => {
    const { queryByTestId } = render(
      <MockRouter params={mockRouterParam}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [generateDetailMock({ status: SubscriptionStatus.Canceled })],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    const paymentButton = queryByTestId('edit-payment-button')
    const addressButton = queryByTestId('edit-address-button')
    const frequencyButton = queryByTestId('edit-frequency-button')

    expect(paymentButton).toBe(null)
    expect(addressButton).toBe(null)
    expect(frequencyButton).toBe(null)
  })
})
