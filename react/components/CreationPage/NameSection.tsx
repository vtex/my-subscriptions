import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import Label from '../LabeledInfo'
import SubscriptionName from '../SubscriptionName'
import { Product } from '.'

const NameSection: FunctionComponent<Props> = ({
  name,
  onChangeName,
  products,
}) => (
  <Label
    label={
      <FormattedMessage
        id="store/creation-page.name-section.label"
        defaultMessage="Give a name to your subscription"
      />
    }
  >
    <span className="t-heading-4">
      <SubscriptionName
        canEdit
        name={name}
        skus={products.map((product) => ({ name: product.name }))}
        onSubmit={onChangeName}
        withIconBackground
      />
    </span>
  </Label>
)

type Props = {
  products: Product[]
  name: string | null
  onChangeName: (name: string) => void
}

export default NameSection
