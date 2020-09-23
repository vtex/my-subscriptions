/* eslint-disable react/jsx-handler-names */
import React, { FunctionComponent } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { useField } from 'formik'

import FREQUENCY_QUERY, {
  Args,
  Result,
} from '../../../graphql/queries/frequencyOptions.gql'
import { queryWrapper } from '../../../tracking'
import { INSTANCE, SubscriptionForm } from '..'
import Skeleton from './Skeleton'
import FrequencySelector from '../../Selector/Frequency'

const FrequencySection: FunctionComponent<Props> = ({ frequencies }) => {
  const [frequencyField, , frequencyHelper] = useField<
    SubscriptionForm['frequency']
  >('frequency')
  const [purchaseDayField, , purchaseHelper] = useField<
    SubscriptionForm['purchaseDay']
  >('purchaseDay')

  return (
    <FrequencySelector
      availableFrequencies={frequencies}
      selectedFrequency={frequencyField.value}
      onChangeFrequency={frequencyHelper.setValue}
      onBlurFrequency={frequencyField.onBlur}
      onChangePurchaseDay={purchaseHelper.setValue}
      onBlurPurchaseDay={purchaseDayField.onBlur}
      selectedPurchaseDay={purchaseDayField.value}
    />
  )
}

type ChildProps = {
  loading: boolean
  frequencies: Result['frequencies']
}

type OuterProps = {
  planId: string
}

type InnerProps = ChildProps

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  queryWrapper<OuterProps, Result, Args, ChildProps>(
    `${INSTANCE}/FrequencySection`,
    FREQUENCY_QUERY,
    {
      props: ({ data }) => ({
        loading: data?.loading ?? false,
        frequencies: data?.frequencies ?? [],
      }),
    }
  ),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(FrequencySection)
