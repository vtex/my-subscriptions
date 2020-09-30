/* eslint-disable react/jsx-handler-names */
import React, { FunctionComponent } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { useIntl } from 'react-intl'
import { useField } from 'formik'
import { DatePicker, Checkbox } from 'vtex.styleguide'

import FREQUENCY_QUERY, {
  Args,
  Result,
} from '../../../graphql/queries/frequencyOptions.gql'
import { queryWrapper } from '../../../tracking'
import { INSTANCE, SubscriptionForm } from '..'
import Skeleton from './Skeleton'
import FrequencySelector from '../../Selector/Frequency'
import { getFutureDate } from '../utils'

const DEFAULT_EXPIRATION = 6

const FrequencySection: FunctionComponent<Props> = ({ frequencies }) => {
  const [frequencyField, frequencyMeta, frequencyHelper] = useField<
    SubscriptionForm['frequency']
  >('frequency')
  const [purchaseDayField, purchaseMeta, purchaseHelper] = useField<
    SubscriptionForm['purchaseDay']
  >('purchaseDay')

  const [nextPurchaseDateField, , nextPurchaseDateHelper] = useField<
    SubscriptionForm['nextPurchaseDate']
  >('nextPurchaseDate')
  const [expirationDateField, , expirationDateHelper] = useField<
    SubscriptionForm['expirationDate']
  >('expirationDate')

  const { locale, formatMessage } = useIntl()

  return (
    <div className="flex">
      <div className="w-50-l w-100">
        <FrequencySelector
          availableFrequencies={frequencies}
          selectedFrequency={frequencyField.value}
          onChangeFrequency={frequencyHelper.setValue}
          onBlurFrequency={frequencyField.onBlur}
          onChangePurchaseDay={purchaseHelper.setValue}
          onBlurPurchaseDay={purchaseDayField.onBlur}
          selectedPurchaseDay={purchaseDayField.value}
          errorMessageFrequency={
            frequencyMeta.error &&
            frequencyMeta.touched &&
            formatMessage({ id: 'store/required-field' })
          }
          errorMessagePurchaseDay={
            purchaseMeta.error &&
            purchaseMeta.touched &&
            formatMessage({ id: 'store/required-field' })
          }
        />
      </div>
      <div className="w-50-l w-100 pl6-l pl0">
        <DatePicker
          label={formatMessage({
            id: 'store/creation-page.frequency-section.next-purchase-date',
            defaultMessage: 'First purchase:',
          })}
          value={nextPurchaseDateField.value}
          onChange={nextPurchaseDateHelper.setValue}
          locale={locale}
        />
        <div className="pt6">
          <Checkbox
            checked={!!expirationDateField.value}
            id="display-end-date"
            label={formatMessage({
              id: 'store/creation-page.frequency-section.add-expiration-date',
              defaultMessage: 'Add expiration date',
            })}
            name="display-end-date"
            onChange={() =>
              expirationDateHelper.setValue(
                expirationDateField.value
                  ? null
                  : getFutureDate({
                      date: nextPurchaseDateField.value,
                      months: DEFAULT_EXPIRATION,
                    })
              )
            }
          />
        </div>
      </div>
    </div>
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
