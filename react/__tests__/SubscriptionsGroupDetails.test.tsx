import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import SubscriptionPaymentError, {
  orderGroupId as paymentErrorOrderGroup,
} from '../mocks/SubscriptionPaymentError'
import RegularSubscription, {
  orderGroupId as regularSubscriptionOrderGroup,
} from '../mocks/RegularSubscription'

describe('SubscriptionGroupDetails Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    // @ts-ignore
  })

  afterAll(() => {
    window.location = location
  })

  test('should display retry', async () => {
    const { queryByText } = render(
      <MockRouter params={{ orderGroup: paymentErrorOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [SubscriptionPaymentError] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(/subscription.retry.button.message/)).toBeTruthy()
  })

  test('shouldnt display retry', async () => {
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

    expect(queryByText(/subscription.retry.button.message/)).toBeFalsy()
  })

  test('shouldnt display address error', async () => {
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

  test('should display address error', async () => {
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

  test('shouldnt display address error action when the subscription status is not active', async () => {
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
      queryByText(/subscription.shipping-address.error.action/)
    ).toBeFalsy()
  })
})
