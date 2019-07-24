import React from 'react'
import { render } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { SubscriptionStatusEnum } from '../constants'
import RegularSubscription, {
  orderGroupId as regularSubscriptionOrderGroup,
} from '../mocks/RegularSubscription'

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

    const { getAllByTestId } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    const buttons = getAllByTestId('edit-button')

    expect(buttons.map((button: any) => button.disabled)).toEqual([
      true,
      true,
      true,
    ])
  })

  test('Shouldnt display edit button', async () => {
    const noAddress = { ...RegularSubscription }
    // @ts-ignore
    noAddress.result.data.groupedSubscription.status =
      SubscriptionStatusEnum.Canceled

    const { queryAllByTestId } = render(
      <MockRouter params={{ orderGroup: regularSubscriptionOrderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        // @ts-ignore
        graphql: { mocks: [noAddress] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    const buttons = queryAllByTestId('edit-button')

    expect(buttons.map((button: any) => button.disabled)).toEqual([])
  })
})
