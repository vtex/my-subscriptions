import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import SubscriptionPaymentError from '../mocks/SubscriptionPaymentError'
import RegularSubscription from '../mocks/RegularSubscription'
import { orderGroup as regularSubscriptionOrderGroup } from '../mocks'
import Products from '../mocks/OneProduct'

describe('Retry Scenarios', () => {
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
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [SubscriptionPaymentError, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(/subscription.retry.button.message/)).toBeTruthy()
  })

  test('Shouldnt display retry', async () => {
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

    expect(queryByText(/subscription.retry.button.message/)).toBeFalsy()
  })
})
