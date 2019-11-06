import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import { generateSubscriptionsGroup } from '../mocks'
import Products from '../mocks/OneProduct'

import GROUP_QUERY from '../graphql/groupedSubscription.gql'
import FREQUENCY_QUERY from '../graphql/getFrequencyOptions.gql'
import MUTATION from '../graphql/updateSubscriptionSettings.gql'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  test('Should update the ', async () => {
    const group = generateSubscriptionsGroup({})

    const { queryByTestId, queryByText, debug } = render(
      <MockRouter params={{ orderGroup: group.orderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            {
              request: {
                query: GROUP_QUERY,
                variables: { orderGroup: group.orderGroup },
              },
              result: {
                data: {
                  groupedSubscription: group,
                },
              },
            },
            {
              request: {
                query: FREQUENCY_QUERY,
                variables: { orderGroup: group.orderGroup },
              },
              result: {
                data: {
                  frequencyOptions: [
                    {
                      periodicity: 'WEEKLY',
                      interval: 1,
                    },
                  ],
                },
              },
            },
            Products,
            {
              request: {
                query: MUTATION,
                variables: {
                  orderGroup: group.orderGroup,
                  interval: 1,
                  periodicity: 'MONTHLY',
                  purchaseDay: '10',
                },
              },
              result: {
                data: {
                  updateSettings: generateSubscriptionsGroup({
                    nextPurchaseDate: '2019-11-09T09:10:04Z',
                    estimatedDeliveryDate: '2019-11-14T00:00:00Z',
                  }),
                },
              },
            },
          ],
        },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    // nextPurchaseDate
    expect(queryByText('7/10/2019')).toBeTruthy()
    // estimatedDeliveryDate
    expect(queryByText('7/16/2019')).toBeTruthy()

    fireEvent.click(queryByTestId('edit-frequency-button') as HTMLElement)

    await new Promise(resolve => setTimeout(resolve, 0))

    fireEvent.click(queryByText('Save') as HTMLElement)

    await new Promise(resolve => setTimeout(resolve, 0))
    debug()

    // nextPurchaseDate
    // expect(queryByText('9/11/2019')).toBeTruthy()
    // // estimatedDeliveryDate
    // expect(queryByText('14/11/2019')).toBeTruthy()
  })
})
