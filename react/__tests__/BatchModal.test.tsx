import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import BatchModal from '../components/Details/BatchModal'
import { generateSubscription } from '../mocks/subscriptionFactory'
import { generateListByMock, generateUpdateAddressMock } from '../mocks'
import { requestLoad } from './utils'

describe('BatchModal Scenarios', () => {
  it('Shouldnt display the target subscription on the list', async () => {
    const targetSubscription = generateSubscription({ name: 'Target Subs' })

    const name1 = 'Id 1'
    const name2 = 'Id 2'
    const name3 = 'Id 3'

    const { queryByText } = render(
      <BatchModal
        currentSubscription={targetSubscription}
        onClose={() => null}
        value=""
        option="ADDRESS"
      />,
      {
        graphql: {
          mocks: [
            generateListByMock({
              result: [
                generateSubscription({ subscriptionId: '1', name: name1 }),
                generateSubscription({ subscriptionId: '2', name: name2 }),
                generateSubscription({ subscriptionId: '3', name: name3 }),
              ],
            }),
          ],
        },
      }
    )

    await requestLoad()

    const target = queryByText(targetSubscription.name as string)
    const one = queryByText(name1)
    const two = queryByText(name2)
    const three = queryByText(name3)

    expect(one).toBeDefined()
    expect(two).toBeDefined()
    expect(three).toBeDefined()
    expect(target).toBeNull()
  })

  it('Should close after finish all requests with success', async () => {
    const currentSubscription = generateSubscription({ name: 'Target Subs' })
    const targetSubscription = generateSubscription({ subscriptionId: 'Id1' })
    const onClose = jest.fn()

    const { queryByText } = render(
      <BatchModal
        currentSubscription={currentSubscription}
        onClose={onClose}
        value=""
        option="ADDRESS"
      />,
      {
        graphql: {
          mocks: [
            generateListByMock({
              result: [generateSubscription({ subscriptionId: '1' })],
            }),
            generateUpdateAddressMock({
              variables: {
                subscriptionId: targetSubscription.id,
                addressId: targetSubscription.addressId,
                addressType: targetSubscription.shippingAddress
                  ?.addressType as string,
              },
            }),
          ],
        },
      }
    )

    await requestLoad()

    fireEvent.click(queryByText('Save') as HTMLElement)

    await requestLoad()

    expect(onClose).toHaveBeenCalled()
  })
})
