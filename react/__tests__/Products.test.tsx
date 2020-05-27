import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import ProductsContainer from '../components/Details/Products'
import { generateSubscriptionsGroup } from '../mocks'

describe('Products Scenarios', () => {
  it('Should list one product', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer subscription={generateSubscriptionsGroup({})} />
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item')).toHaveLength(1)
  })

  it('Should list two products', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer
        subscription={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
      />
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item')).toHaveLength(2)
  })

  it('Should display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer
        subscription={generateSubscriptionsGroup({ subscriptionsAmount: 2 })}
      />
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button')).toHaveLength(2)
  })

  it('Shouldnt display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer subscription={generateSubscriptionsGroup({})} />
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button')).toHaveLength(0)
  })
})
