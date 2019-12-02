import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import {
  generateDetailMock,
  generateSubscriptionsGroup,
  orderGroup,
} from '../mocks'

import FREQUENCY_QUERY from '../graphql/frequencyOptions.gql'
import MUTATION from '../graphql/updateSubscriptionSettings.gql'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  test('Should update the nextPurchaseDate and estimatedDeliveryDate after editing', async () => {
    const mock = generateDetailMock()
    const periodicity = mock.result.data.group.plan.frequency.periodicity
    const { queryByTestId, queryByText } = render(
      <MockRouter params={{ subscriptionsGroupId: orderGroup }}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            mock,
            {
              request: {
                query: FREQUENCY_QUERY,
                variables: { subscriptionsGroupId: orderGroup },
              },
              result: {
                data: {
                  frequencies: [
                    {
                      periodicity,
                      interval: 1,
                    },
                  ],
                },
              },
            },
            {
              request: {
                query: MUTATION,
                variables: {
                  subscriptionsGroupId: orderGroup,
                  interval: 1,
                  periodicity,
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
    await new Promise(resolve => setTimeout(resolve, 0))

    // nextPurchaseDate
    expect(queryByText('11/9/2019')).toBeTruthy()
    // estimatedDeliveryDate
    expect(queryByText('11/14/2019')).toBeTruthy()
  })
})
