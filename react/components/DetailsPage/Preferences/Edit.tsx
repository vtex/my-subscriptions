import React, { Component } from 'react'
import { injectIntl, defineMessages, WrappedComponentProps } from 'react-intl'
import { compose, branch, renderComponent } from 'recompose'
import { Subscription, Frequency } from 'vtex.subscriptions-graphql'
import { Dropdown, Alert } from 'vtex.styleguide'

import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'
import { queryWrapper } from '../../../tracking'
import QUERY, {
  Result,
  Args,
} from '../../../graphql/queries/availablePreferences.gql'
import { INSTANCE } from '..'
import Skeleton from './Skeleton'
import EditionButtons from '../EditionButtons'
import {
  displayWeekDay,
  displayPeriodicity,
  WEEK_OPTIONS,
  MONTH_OPTIONS,
} from '../../Frequency/utils'

const messages = defineMessages({
  title: {
    id: 'store/details-page.preferences.title',
  },
  selectDay: { id: 'store/subscription.select.day' },
  orderAgain: { id: 'store/subscription.data.orderAgain' },
  chargeEvery: {
    id: 'store/subscription.data.chargeEvery',
  },
  select: { id: 'store/subscription.select' },
})

class EditPreferences extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { plan } = props
    const { interval, periodicity } = plan.frequency

    this.state = {
      purchaseDay: plan.purchaseDay,
      frequencyIndex: this.findCurrentFrequencyIndex({ periodicity, interval }),
    }
  }

  private findCurrentFrequencyIndex = ({
    periodicity,
    interval,
  }: Frequency) => {
    const { frequencies } = this.props
    if (!frequencies || !frequencies.length) {
      return 0
    }

    const index = frequencies.findIndex(
      (option) =>
        option.periodicity === periodicity && option.interval === interval
    )

    return index >= 0 ? index : 0
  }

  private getFrequencyOptions = () => {
    const { intl, frequencies } = this.props

    if (!frequencies) return []

    return frequencies.map((frequency, index: number) => ({
      value: index,
      label: displayPeriodicity({ intl, ...frequency }),
    }))
  }

  private getCurrentFrequency = () => {
    return (
      this.props.frequencies &&
      this.props.frequencies[this.state.frequencyIndex]
    )
  }

  private getIntervalOptions = () => {
    const { intl } = this.props
    const frequency = this.getCurrentFrequency()

    if (frequency && frequency.periodicity === 'WEEKLY') {
      return WEEK_OPTIONS.map((weekDay) => ({
        value: weekDay,
        label: displayWeekDay({ weekDay, intl }),
      }))
    }

    return MONTH_OPTIONS.map((dayOfMonth) => ({
      value: dayOfMonth,
      label: intl.formatMessage(messages.selectDay, { day: dayOfMonth }),
    }))
  }

  private handleSave = () => null

  public render() {
    const {
      intl,
      isLoading,
      onCancel,
      onDismissError,
      errorMessage,
    } = this.props
    const { frequencyIndex, purchaseDay } = this.state

    const currentFrequency = this.getCurrentFrequency()

    return (
      <Box title={intl.formatMessage(messages.title)}>
        <Section borderTop>
          {errorMessage && (
            <div className="mb6">
              <Alert type="error" onClose={onDismissError}>
                {errorMessage}
              </Alert>
            </div>
          )}
          <Dropdown
            label={intl.formatMessage(messages.orderAgain)}
            placeholder={intl.formatMessage(messages.select)}
            options={this.getFrequencyOptions()}
            value={frequencyIndex}
          />
          {currentFrequency?.periodicity !== 'DAILY' && purchaseDay && (
            <div className="pt6">
              <Dropdown
                label={intl.formatMessage(messages.chargeEvery)}
                placeholder={intl.formatMessage(messages.select)}
                options={this.getIntervalOptions()}
                value={purchaseDay}
              />
            </div>
          )}
        </Section>
        <div className="w-100 ph7 pt7 flex justify-end">
          <EditionButtons
            isLoading={isLoading}
            onCancel={onCancel}
            onSave={this.handleSave}
          />
        </div>
      </Box>
    )
  }
}

interface State {
  purchaseDay: string | null
  frequencyIndex: number
}

type OuterProps = {
  subscriptionId: string
  plan: Subscription['plan']
  onSave: () => void
  onCancel: () => void
  onDismissError: () => void
  isLoading: boolean
  errorMessage: string | null
}

type ChildProps = {
  loading: boolean
  addresses?: Result['addresses']
  frequencies?: Result['frequencies']
  payments?: Result['payments']
}

type Props = OuterProps & ChildProps & WrappedComponentProps

const enhance = compose<Props, OuterProps>(
  injectIntl,
  queryWrapper<OuterProps, Result, Args, ChildProps>(
    `${INSTANCE}/EditPreferences`,
    QUERY,
    {
      props: ({ data }) => ({
        loading: data ? data.loading : false,
        addresses: data?.addresses,
        frequencies: data?.frequencies,
        payments: data?.payments,
      }),
    }
  ),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(EditPreferences)
