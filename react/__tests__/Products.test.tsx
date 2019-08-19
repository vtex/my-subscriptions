import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import ProductsContainer from '../components/pages/Details/Products'
import OneProduct from '../mocks/OneProduct'
import TwoProducts from '../mocks/TwoProducts'
import { orderGroup } from '../mocks'

describe('Products Scenarios', () => {
  test('Should list one product', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer orderGroup={orderGroup} />,
      {
        graphql: { mocks: [OneProduct] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item').length).toBe(1)
  })

  test('Should list two products', async () => {
    const { queryAllByTestId } = render(
      <ProductsContainer orderGroup={orderGroup} />,
      {
        graphql: { mocks: [TwoProducts] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(queryAllByTestId('products-item').length).toBe(2)
  })

  test('Should display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer orderGroup={orderGroup} />,
      {
        graphql: { mocks: [TwoProducts] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button').length).toBe(2)
  })

  test('Shouldnt display remove button', async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <ProductsContainer orderGroup={orderGroup} />,
      {
        graphql: { mocks: [OneProduct] },
      }
    )

    await new Promise(resolve => setTimeout(resolve, 0))

    fireEvent.click(queryByTestId('edit-products-button') as HTMLElement)

    expect(queryAllByTestId('delete-subscription-button').length).toBe(0)
  })
})
