import React from 'react'
import { render, fireEvent, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/pages/Details'
import {
  generateDetailMock,
  generateSubscriptionsGroup,
  orderGroup as subscriptionsGroupId,
} from '../mocks'
import FREQUENCY_QUERY from '../graphql/frequencyOptions.gql'
import MUTATION from '../graphql/updatePlan.gql'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    jest.useFakeTimers()
  })

  afterAll(() => {
    window.location = location
  })

  it('Should update the nextPurchaseDate and estimatedDeliveryDate after editing', () =>
    act(async () => {
      const mock = generateDetailMock()
      const { periodicity } = mock.result.data.group.plan.frequency
      const { queryByTestId, queryByText } = render(
        <MockRouter params={{ subscriptionsGroupId }}>
          <SubscriptionDetails />
        </MockRouter>,
        {
          graphql: {
            mocks: [
              mock,
              {
                request: {
                  query: FREQUENCY_QUERY,
                  variables: { subscriptionsGroupId },
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
                    subscriptionsGroupId,
                    interval: 1,
                    periodicity,
                    purchaseDay: '10',
                  },
                },
                result: {
                  data: {
                    updatePlan: generateSubscriptionsGroup({
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

      await wait(() => jest.runAllTimers())

      // nextPurchaseDate
      expect(queryByText('7/10/2019')).toBeTruthy()
      // estimatedDeliveryDate
      expect(queryByText('7/16/2019')).toBeTruthy()

      fireEvent.click(queryByTestId('edit-frequency-button') as HTMLElement)

      await wait(() => jest.runAllTimers())

      fireEvent.click(queryByText('Save') as HTMLElement)

      await wait(() => jest.runAllTimers())

      // nextPurchaseDate
      expect(queryByText('11/9/2019')).toBeTruthy()
      // estimatedDeliveryDate
      expect(queryByText('11/14/2019')).toBeTruthy()
    }))
})
