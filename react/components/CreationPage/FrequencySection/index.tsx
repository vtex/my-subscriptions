import React, { FunctionComponent } from 'react'
import { compose, branch, renderComponent } from 'recompose'

import FREQUENCY_QUERY, {
  Args,
  Result,
} from '../../../graphql/queries/frequencyOptions.gql'
import { queryWrapper } from '../../../tracking'
import { INSTANCE } from '..'
import Skeleton from './Skeleton'
import FrequencySelector from '../../Frequency/Selector'

const FrequencySection: FunctionComponent<Props> = ({
  frequencies,
  onChangeFrequency,
  onChangePurchaseDay,
  selectedPurchaseDay,
  selectedFrequency,
}) => (
  <FrequencySelector
    availableFrequencies={frequencies}
    onChangeFrequency={onChangeFrequency}
    onChangePurchaseDay={onChangePurchaseDay}
    selectedPurchaseDay={selectedPurchaseDay}
    selectedFrequency={selectedFrequency}
  />
)

type ChildProps = {
  loading: boolean
  frequencies: Result['frequencies']
}

type OuterProps = {
  planId: string
  onChangePurchaseDay: (day: string) => void
  onChangeFrequency: (frequency: string) => void
  selectedPurchaseDay: string
  selectedFrequency: string
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
