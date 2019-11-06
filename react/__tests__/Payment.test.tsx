import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import RegularSubscription from '../mocks/RegularSubscription'
import { orderGroup as regularSubscriptionOrderGroup } from '../mocks'
import Products from '../mocks/OneProduct'

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
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [RegularSubscription, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeFalsy()
  })

  test('Should display payment error', async () => {
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.purchaseSettings.paymentMethod = null

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(INVALID_PAYMENT)).toBeTruthy()
  })

  test('Should display payment no-action error when the subscription status is not active', async () => {
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.purchaseSettings.paymentMethod = null
    noAddress.result.data.groupedSubscription.status =
      SubscriptionStatusEnum.Paused

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText('The selected payment method is not available anymore.')
    ).toBeTruthy()
  })
})
