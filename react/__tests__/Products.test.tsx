import React from 'react'
import { render, fireEvent, wait } from '@vtex/test-tools/react'
import { act } from 'react-dom/test-utils'

import ProductsContainer from '../components/pages/Details/Products'
import { generateSubscriptionsGroup } from '../mocks'

describe('Products Scenarios', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('Should list one product', () =>
    act(async () => {
      const { queryAllByTestId } = render(
        <ProductsContainer group={generateSubscriptionsGroup({})} />
      )

      await wait(() => jest.runAllTimers())

      expect(queryAllByTestId('products-item')).toHaveLength(1)
    }))

  it('Should list two products', () =>
    act(async () => {
      const { queryAllByTestId } = render(
        <ProductsContainer
          group={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
        />
      )

      await wait(() => jest.runAllTimers())

      expect(queryAllByTestId('products-item')).toHaveLength(2)
    }))

  it('Should display remove button', () =>
    act(async () => {
      const { queryByTestId, queryAllByTestId } = render(
        <ProductsContainer
          group={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
        />
      )

      await wait(() => jest.runAllTimers())

      fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

      expect(queryAllByTestId('delete-subscription-button')).toHaveLength(2)
    }))

  it('Shouldnt display remove button', () =>
    act(async () => {
      const { queryByTestId, queryAllByTestId } = render(
        <ProductsContainer group={generateSubscriptionsGroup({})} />
      )

      await wait(() => jest.runAllTimers())

      fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

      expect(queryAllByTestId('delete-subscription-button')).toHaveLength(0)
    }))
})
