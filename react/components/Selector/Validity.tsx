import React, { FunctionComponent } from 'react'
import { useIntl } from 'react-intl'
import { DatePicker, Checkbox } from 'vtex.styleguide'

import { getFutureDate } from './utils'

const DEFAULT_EXPIRATION = 6

const ValiditySelector: FunctionComponent<Props> = ({
  beginDate,
  onChangeBeginDate,
  endDate,
  onChangeEndDate,
}) => {
  const { locale, formatMessage } = useIntl()

  return (
    <>
      <DatePicker
        label={formatMessage({
          id: 'store/validity-selector.begin-date',
          defaultMessage: 'First purchase:',
        })}
        value={beginDate}
        onChange={(date: Date) => onChangeBeginDate(date)}
        locale={locale}
      />
      <div className="pt6">
        <Checkbox
          checked={!!endDate}
          id="display-end-date"
          label={formatMessage({
            id: 'store/validity-selector.add-end-date',
            defaultMessage: 'Add expiration date',
          })}
          name="display-end-date"
          onChange={() =>
            onChangeEndDate(
              endDate
                ? null
                : getFutureDate({ date: beginDate, months: DEFAULT_EXPIRATION })
            )
          }
        />
      </div>
      {endDate && (
        <div className="pt4">
          <DatePicker
            label={formatMessage({
              id: 'store/validity-selector.end-date',
              defaultMessage: 'Expires in:',
            })}
            value={endDate}
            minDate={getFutureDate({ date: beginDate, days: 1 })}
            onChange={(date: Date) => onChangeEndDate(date)}
            locale={locale}
          />
        </div>
      )}
    </>
  )
}

type Props = {
  beginDate: Date
  endDate: Date | null
  onChangeBeginDate: (date: Date) => void
  onChangeEndDate: (date: Date | null) => void
}

export default ValiditySelector
