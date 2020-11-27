import React, { FunctionComponent } from 'react'
import { useField } from 'formik'
import { FormattedMessage } from 'react-intl'

import Label from '../LabeledInfo'
import SubscriptionName from '../SubscriptionName'
import { SubscriptionForm } from '.'

const NameSection: FunctionComponent = () => {
  const [nameField, , { setValue }] = useField<SubscriptionForm['name']>('name')
  const [productsField] = useField<SubscriptionForm['products']>('products')

  return (
    <Label label={<FormattedMessage id="creation-page.name-section.label" />}>
      <span className="t-heading-4">
        <SubscriptionName
          canEdit
          name={nameField.value}
          skus={productsField.value.map((product) => ({ name: product.name }))}
          onSubmit={(name) => setValue(name)}
          // eslint-disable-next-line react/jsx-handler-names
          onBlur={nameField.onBlur}
          withIconBackground
        />
      </span>
    </Label>
  )
}

export default NameSection
