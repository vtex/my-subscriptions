import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import RegularSubscription from '../mocks/RegularSubscription'
import { orderGroup as regularSubscriptionOrderGroup } from '../mocks'
import Products from '../mocks/OneProduct'

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
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.status =
      SubscriptionStatusEnum.Paused

    const { queryByTestId } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress, Products] },
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
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.status =
      SubscriptionStatusEnum.Canceled

    const { queryByTestId } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress, Products] },
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
