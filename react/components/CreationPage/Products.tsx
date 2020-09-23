import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { FieldArray } from 'formik'
import { Box } from 'vtex.styleguide'

import { Product } from '.'
import AddItemModal, { OnAddItemArgs } from '../AddItemModal'
import ProductListItem from '../ProductListItem'

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
              onAddItem={({
                onError,
                onFinish,
                plans,
                ...productArgs
              }: OnAddItemArgs) => {
                if (!values.planId) {
                  setFieldValue('planId', plans[0])
                }

                push(productArgs)
                onFinish()
              }}
            />
          </div>
          {values.products.map((product: Product, i: number) => (
            <div
              className={i !== values.products.length - 1 ? 'mb8' : ''}
              key={product.skuId}
            >
              <ProductListItem
                isEditing
                canRemove
                name={product.name}
                quantity={product.quantity}
                imageUrl={product.imageUrl}
                measurementUnit={product.measurementUnit}
                unitMultiplier={product.unitMultiplier}
                brandName={product.brand}
                price={product.price}
                currency={currencyCode}
                onChange={(quantity: number) =>
                  replace(i, { ...product, quantity })
                }
                onRemove={() => {
                  if (values.products.length === 1) {
                    setFieldValue('planId', null)
                  }
                  remove(i)
                }}
              />
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
