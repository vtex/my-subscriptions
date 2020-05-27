import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/Details'
import {
  generateDetailMock,
  generateSubscriptionsGroup,
  MOCK_ROUTER_PARAM,
  SUBSCRIPTION_ID,
} from '../mocks'
import FREQUENCY_QUERY, {
  Args as QueryArgs,
} from '../graphql/queries/frequencyOptions.gql'
import MUTATION, {
  Args as UpdateArgs,
} from '../graphql/mutations/updatePlan.gql'

describe('Payment Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterAll(() => {
    window.location = location
  })

  it('Should update the dates after editing frequency', async () => {
    const mock = generateDetailMock()
    const { periodicity } = mock.result.data.subscription.plan.frequency
    const queryVariables: QueryArgs = { subscriptionId: SUBSCRIPTION_ID }
    const mutationVariables: UpdateArgs = {
      subscriptionId: SUBSCRIPTION_ID,
      interval: 1,
      periodicity,
      purchaseDay: '10',
    }
    const { queryByTestId, queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            mock,
            {
              request: {
                query: FREQUENCY_QUERY,
                variables: queryVariables,
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
                variables: mutationVariables,
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

    await new Promise((resolve) => setTimeout(resolve, 0))

    // nextPurchaseDate
    expect(queryByText('7/10/2019')).toBeTruthy()
    // estimatedDeliveryDate
    expect(queryByText('7/16/2019')).toBeTruthy()

    fireEvent.click(queryByTestId('edit-frequency-button') as HTMLElement)

    await new Promise((resolve) => setTimeout(resolve, 0))

    fireEvent.click(queryByText('Save') as HTMLElement)

    await new Promise((resolve) => setTimeout(resolve, 0))
    await new Promise((resolve) => setTimeout(resolve, 0))

    // nextPurchaseDate
    expect(queryByText('11/9/2019')).toBeTruthy()
    // estimatedDeliveryDate
    expect(queryByText('11/14/2019')).toBeTruthy()
  })
})
