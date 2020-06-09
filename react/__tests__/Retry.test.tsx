import React from 'react'
import { render } from '@vtex/test-tools/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import MockRouter from 'react-mock-router'

import SubscriptionDetails from '../components/Details'
import { MOCK_ROUTER_PARAM, generateDetailMock } from '../mocks'

const RETRY_BUTTON = 'Try again'

describe('Retry Scenarios', () => {
  const { location } = window

  beforeAll(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  it('Should display retry', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [
            generateDetailMock({
              lastExecutionStatus: 'PAYMENT_ERROR',
            }),
          ],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(RETRY_BUTTON)).toBeTruthy()
  })

  it('Shouldnt display retry', async () => {
    const { queryByText } = render(
      <MockRouter params={MOCK_ROUTER_PARAM}>
        <SubscriptionDetails />
      </MockRouter>,
      {
        graphql: {
          mocks: [generateDetailMock()],
        },
      }
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryByText(RETRY_BUTTON)).toBeFalsy()
  })
})
