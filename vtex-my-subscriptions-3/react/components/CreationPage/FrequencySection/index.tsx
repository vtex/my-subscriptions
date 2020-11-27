/* eslint-disable react/jsx-handler-names */
import React, { FunctionComponent } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { useIntl, defineMessages } from 'react-intl'
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

const messages = defineMessages({
  required: {
    id: 'required-field',
  },
  nextPurchase: {
    id: 'creation-page.frequency-section.next-purchase-date',
  },
  addExpiration: {
    id: 'creation-page.frequency-section.add-expiration-date',
  },
  expirationDate: {
    id: 'creation-page.frequency-section.expiration-date',
  },
})

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
      <div className="w-50-ns w-100">
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
            formatMessage(messages.required)
          }
          errorMessagePurchaseDay={
            purchaseMeta.error &&
            purchaseMeta.touched &&
            formatMessage(messages.required)
          }
        />
      </div>
      <div className="w-50-ns w-100 pl6-ns pl0">
        <DatePicker
          label={formatMessage(messages.nextPurchase)}
          value={nextPurchaseDateField.value}
          onChange={nextPurchaseDateHelper.setValue}
          locale={locale}
        />
        <div className="pt6">
          <Checkbox
            checked={!!expirationDateField.value}
            id="display-end-date"
            label={formatMessage(messages.addExpiration)}
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
        {expirationDateField.value && (
          <div className="pt4">
            <DatePicker
              label={formatMessage(messages.expirationDate)}
              value={expirationDateField.value}
              minDate={getFutureDate({
                date: nextPurchaseDateField.value,
                days: 1,
              })}
              onChange={expirationDateHelper.setValue}
              locale={locale}
            />
          </div>
        )}
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
