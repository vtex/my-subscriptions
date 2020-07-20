import React from 'react'
import { render } from '@vtex/test-tools/react'

import BatchModal from '../components/Details/BatchModal'
import { generateSubscription } from '../mocks/subscriptionFactory'
import { generateListByMock } from '../mocks'

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

    await new Promise((resolve) => setTimeout(resolve, 0))

    const target = queryByText(targetSubscription.name as string)
    const one = queryByText(name1)
    const two = queryByText(name2)
    const three = queryByText(name3)

    expect(one).toBeDefined()
    expect(two).toBeDefined()
    expect(three).toBeDefined()
    expect(target).toBeNull()
  })
})
