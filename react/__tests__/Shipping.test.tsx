import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import RegularSubscription from '../mocks/RegularSubscription'
import { orderGroup as regularSubscriptionOrderGroup } from '../mocks'
import Products from '../mocks/OneProduct'

const ERROR_MESSAGE =
  'Invalid address, select a new valid address for this subscription.'

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
        graphql: { mocks: [RegularSubscription, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeFalsy()
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
        graphql: { mocks: [noAddress, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryByText(ERROR_MESSAGE)).toBeTruthy()
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
        graphql: { mocks: [noAddress, Products] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(
      queryByText('The selected address is not available anymore.')
    ).toBeTruthy()
  })
})
