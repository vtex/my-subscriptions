import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import ProductsContainer from '../components/pages/Details/Products'
import { generateSubscriptionsGroup } from '../mocks'

describe('Products Scenarios', () => {
  test('Should list one product', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer group={generateSubscriptionsGroup({})} />
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item').length).toBe(1)
  })

  test('Should list two products', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer
        group={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
      />
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item').length).toBe(2)
  })

  test('Should display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer
        group={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
      />
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button').length).toBe(2)
  })

  test('Shouldnt display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer group={generateSubscriptionsGroup({})} />
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button').length).toBe(0)
  })
})
