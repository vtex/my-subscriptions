import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import RegularSubscription, {
  orderGroupId as regularSubscriptionOrderGroup,
} from '../mocks/RegularSubscription'

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
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [RegularSubscription] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText(/subscription.shipping-address.error.message/)
    ).toBeFalsy()
  })

  test('Should display address error', async () => {
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.shippingAddress = null

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText(/subscription.shipping-address.error.message/)
    ).toBeTruthy()
  })

  test('Should display address no-action error when the subscription status is not active', async () => {
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.shippingAddress = null
    noAddress.result.data.groupedSubscription.status =
      SubscriptionStatusEnum.Paused

    const { queryByText } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText(/subscription.shipping-address.error.no-action/)
    ).toBeTruthy()
  })
})
