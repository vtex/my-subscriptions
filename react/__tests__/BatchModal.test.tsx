import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import BatchModal from '../components/Details/BatchModal'
import { generateSubscription } from '../mocks/subscriptionFactory'
import { generateListByMock, generateUpdateAddressMock } from '../mocks'
import { requestLoad } from '../utils/tests'

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
    const showToast = jest.fn()

    const { queryByText } = render(
      <BatchModal
        currentSubscription={currentSubscription}
        onClose={onClose}
        value=""
        option="ADDRESS"
        {...{ showToast }} // To avoid eslint error...
      />,
      {
        graphql: {
          mocks: [
            generateListByMock({
              result: [targetSubscription],
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
    expect(showToast).toHaveBeenCalled()
  })

  it('Should handle error on one or more subscriptions', async () => {
    const currentSubscription = generateSubscription({ name: 'Target Subs' })
    const targetSubscription = generateSubscription({ subscriptionId: 'Id1' })
    const targetSubscription2 = generateSubscription({ subscriptionId: 'Id2' })
    const onClose = jest.fn()
    const showToast = jest.fn()

    const { queryByText } = render(
      <BatchModal
        currentSubscription={currentSubscription}
        onClose={onClose}
        value=""
        option="ADDRESS"
        {...{ showToast }} // To avoid eslint error...
      />,
      {
        graphql: {
          mocks: [
            generateListByMock({
              result: [targetSubscription, targetSubscription2],
            }),
            generateUpdateAddressMock({
              variables: {
                subscriptionId: targetSubscription.id,
                addressId: targetSubscription.addressId,
                addressType: targetSubscription.shippingAddress
                  ?.addressType as string,
              },
            }),
            generateUpdateAddressMock({
              variables: {
                subscriptionId: targetSubscription2.id,
                addressId: targetSubscription2.addressId,
                addressType: targetSubscription2.shippingAddress
                  ?.addressType as string,
              },
              displayError: true,
            }),
          ],
        },
      }
    )

    await requestLoad()

    fireEvent.click(queryByText('Save') as HTMLElement)

    await requestLoad()

    // Still open
    expect(onClose).toHaveBeenCalledTimes(0)
    expect(showToast).toHaveBeenCalledTimes(0)
    expect(queryByText('Something went wrong, try again later!')).toBeDefined()
  })
})
