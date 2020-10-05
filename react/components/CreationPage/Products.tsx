import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { FieldArray, ArrayHelpers, FieldArrayRenderProps } from 'formik'
import { Box } from 'vtex.styleguide'

import { Product } from '.'
import AddItemModal, { OnAddItemArgs } from '../AddItemModal'
import ProductListItem from '../ProductListItem'
import { SimulationConsumer } from '../SimulationContext'

function addItem({
  addItemArgs,
  push,
  setFieldValue,
  values,
}: {
  addItemArgs: OnAddItemArgs
  push: ArrayHelpers['push']
  setFieldValue: FieldArrayRenderProps['form']['setFieldValue']
  values: any
}) {
  const { onError, onFinish, plans, ...productArgs } = addItemArgs

  if (!values.planId) {
    setFieldValue('planId', plans[0])
  }

  push(productArgs)
  onFinish()
}

function removeItem({
  values,
  setFieldValue,
  remove,
  index,
}: {
  values: any
  setFieldValue: FieldArrayRenderProps['form']['setFieldValue']
  remove: ArrayHelpers['remove']
  index: number
}) {
  if (values.products.length === 1) {
    setFieldValue('planId', null)
  }

  remove(index)
}

const Products: FunctionComponent<Props> = ({ currencyCode }) => (
  <Box
    title={<FormattedMessage id="store/creation-page.products-card.title" />}
  >
    <FieldArray name="products">
      {({ form: { values, setFieldValue }, push, replace, remove }) => (
        <>
          <div className="mb7">
            <AddItemModal
              targetPlan={values.planId}
              currency={currencyCode}
              subscribedSkus={values.products.map(
                (product: Product) => product.skuId
              )}
              onAddItem={(args) =>
                addItem({ addItemArgs: args, values, setFieldValue, push })
              }
            />
          </div>
          {values.products.map((product: Product, i: number) => (
            <div
              className={i !== values.products.length - 1 ? 'mb8' : ''}
              key={product.skuId}
            >
              <SimulationConsumer>
                {({ getPrice, loading }) => (
                  <ProductListItem
                    isEditing
                    canRemove
                    name={product.name}
                    quantity={product.quantity}
                    imageUrl={product.imageUrl}
                    measurementUnit={product.measurementUnit}
                    unitMultiplier={product.unitMultiplier}
                    brandName={product.brand}
                    price={getPrice(product.skuId) ?? product.price}
                    currency={currencyCode}
                    isLoadingPrice={loading}
                    onChange={(quantity: number) =>
                      replace(i, { ...product, quantity })
                    }
                    onRemove={() =>
                      removeItem({ values, setFieldValue, remove, index: i })
                    }
                  />
                )}
              </SimulationConsumer>
            </div>
          ))}
        </>
      )}
    </FieldArray>
  </Box>
)

type Props = {
  currencyCode: string
}

export default Products
