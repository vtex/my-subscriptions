/* eslint-disable react/jsx-handler-names */
import React, { FunctionComponent } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { useIntl, defineMessages } from 'react-intl'
import { useField } from 'formik'
import { DatePicker, Checkbox } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import FREQUENCY_QUERY, {
  Args,
  Result,
} from '../../../graphql/queries/frequencyOptions.gql'
import { withQueryWrapper, getRuntimeInfo } from '../../../tracking'
import { SubscriptionForm } from '..'
import Skeleton from './Skeleton'
import FrequencySelector from '../../Selector/Frequency'
import { getFutureDate } from '../utils'
import { WEEK_OPTIONS, MONTH_OPTIONS } from '../../Frequency/utils'
import { INSTANCE } from '../constants'

const CSS_HANDLES = [
  'frequencyWrapper',
  'frequency',
  'calendarNextPurchase',
  'addExpirationDate',
  'calendarExpirationDate',
]

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

  const handles = useCssHandles(CSS_HANDLES)

  const { locale, formatMessage } = useIntl()

  return (
    <div className={`${handles.frequencyWrapper} flex flex-row-ns flex-column`}>
      <div className={`${handles.frequency} w-50-ns w-100`}>
        <FrequencySelector
          availableFrequencies={frequencies}
          selectedFrequency={frequencyField.value}
          onChangeFrequency={(frequency) => {
            frequencyHelper.setValue(frequency)

            const frequencyType = frequency.split(',')?.[1]
            switch (frequencyType) {
              case 'DAILY':
                purchaseHelper.setValue('Not_Applicable')
                break
              case 'WEEKLY':
                const dayOfWeek = new Date().getDay() - 1;
                purchaseHelper.setValue(WEEK_OPTIONS[dayOfWeek])
                break
              case 'MONTHLY':
              case 'YEARLY':
                const purchaseDate = nextPurchaseDateField.value.getDate()
                const purchaseMonth = purchaseDate <= 28
                  ? MONTH_OPTIONS[purchaseDate - 1]
                  : MONTH_OPTIONS[27]
                purchaseHelper.setValue(purchaseMonth)
                break
            }
          }}
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
          isNewSubscription
        />
      </div>
      <div className={`${handles.calendarNextPurchase} w-50-ns w-100 pl6-ns pl0 pt0-ns pt6`}>
        <DatePicker
          label={formatMessage(messages.nextPurchase)}
          value={nextPurchaseDateField.value}
          minDate={new Date()}
          onChange={(date: Date) => {
            nextPurchaseDateHelper.setValue(date)
            frequencyField.value?.split(',') &&
              (frequencyField.value?.split(',')[1] === 'MONTHLY' ||
                frequencyField.value?.split(',')[1] === 'YEARLY') &&
              purchaseHelper.setValue(
                date.getDate() <= 28
                  ? MONTH_OPTIONS[date.getDate() - 1]
                  : MONTH_OPTIONS[27]
              )
          }}
          locale={locale}
        />
        <div className={`${handles.addExpirationDate} pt6`}>
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
          <div className={`${handles.calendarExpirationDate} pt4`}>
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
  withQueryWrapper<OuterProps, Result, Args, ChildProps>({
    getRuntimeInfo,
    workflowInstance: `${INSTANCE}/FrequencySection`,
    document: FREQUENCY_QUERY,
    operationOptions: {
      props: ({ data }) => ({
        loading: data?.loading ?? false,
        frequencies: data?.frequencies ?? [],
      }),
    },
  }),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(FrequencySection)
