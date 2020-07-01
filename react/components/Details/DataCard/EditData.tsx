import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'
import { compose, branch, renderComponent } from 'recompose'
import { ApolloError } from 'apollo-client'
import { Dropdown, Alert } from 'vtex.styleguide'
import {
  MutationUpdateSettingsArgs,
  Periodicity,
} from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'render'

import { CSS, BASIC_CARD_WRAPPER } from '../../../constants'
import FREQUENCY_OPTIONS from '../../../graphql/frequencyOptions.gql'
import UPDATE_SETTINGS from '../../../graphql/updateSubscriptionSettings.gql'
import EditionButtons from '../EditionButtons'
import DataSkeleton from './DataSkeleton'
import { SubscriptionsGroup } from '..'
import { logGraphqlError, queryWrapper } from '../../../tracking'
import {
  displayWeekDay,
  displayPeriodicity,
  WEEK_OPTIONS,
  MONTH_OPTIONS,
} from '../../Frequency/utils'

const messages = defineMessages({
  cardTitle: {
    id: 'store/subscription.data',
    defaultMessage: '',
  },
  selectDay: { id: 'store/subscription.select.day', defaultMessage: '' },
  orderAgain: { id: 'store/subscription.data.orderAgain', defaultMessage: '' },
  chargeEvery: {
    id: 'store/subscription.data.chargeEvery',
    defaultMessage: '',
  },
  select: { id: 'store/subscription.select', defaultMessage: '' },
  errorMessage: {
    id: 'store/subscription.fallback.error.message',
    defaultMessage: '',
  },
})

const INSTANCE = 'SubscriptionsDetails/FrequencyOptions'

class EditData extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { purchaseSettings, plan } = props.group
    const { interval, periodicity } = plan.frequency

    this.state = {
      isLoading: false,
      showErrorAlert: false,
      errorMessage: '',
      purchaseDay: purchaseSettings.purchaseDay,
      frequencyIndex: this.findCurrentFrequencyIndex({ periodicity, interval }),
    }
  }

  private findCurrentFrequencyIndex({ periodicity, interval }: Frequency) {
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

  private getCurrentFrequency() {
    return this.props.frequencies[this.state.frequencyIndex]
  }

  private getFrequencyOptions() {
    const { intl, frequencies } = this.props

    return frequencies.map((frequency: Frequency, index: number) => ({
      value: index,
      label: displayPeriodicity({ intl, ...frequency }),
    }))
  }

  private getIntervalOptions() {
    const { intl } = this.props
    const { periodicity } = this.getCurrentFrequency()

    if (periodicity === 'WEEKLY') {
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

  private handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      purchaseDay: '',
      frequencyIndex: parseInt(e.target.value, 10),
    })
  }

  public handlePurchaseDayChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ purchaseDay: e.target.value })

  public handleSaveClick = () => {
    const { purchaseDay } = this.state
    const { periodicity, interval } = this.getCurrentFrequency()

    this.setState({ isLoading: true })
    const variables = {
      subscriptionsGroupId: this.props.group.id,
      purchaseDay,
      periodicity,
      interval,
    }

    this.props
      .updateSettings({
        variables,
      })
      .then(() => {
        this.setState({ isLoading: false })
        this.props.onCloseEdit()
      })
      .catch((error: ApolloError) => {
        const errorMessage = this.props.intl.formatMessage(
          messages.errorMessage
        )

        logGraphqlError({
          error,
          variables,
          runtime: this.props.runtime,
          type: 'MutationError',
          instance: 'UpdateSettings',
        })
        this.setState({
          isLoading: false,
          showErrorAlert: true,
          errorMessage,
        })
      })
  }

  public render() {
    const { intl } = this.props
    const {
      purchaseDay,
      showErrorAlert,
      errorMessage,
      isLoading,
      frequencyIndex,
    } = this.state

    const { periodicity } = this.getCurrentFrequency()

    const isEditDisabled = purchaseDay === '' && periodicity !== 'DAILY'

    return (
      <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
        <div className="db-s di-ns f4 tl c-on-base">
          {intl.formatMessage(messages.cardTitle)}
        </div>
        <div className="flex pt5 w-100-s mr-auto flex-column">
          {showErrorAlert && (
            <div className="mb5">
              <Alert
                type="error"
                onClose={() => this.setState({ showErrorAlert: false })}
              >
                {errorMessage}
              </Alert>
            </div>
          )}
          <div className="w-50-l w-60-m w-100-s">
            <Dropdown
              label={intl.formatMessage(messages.orderAgain)}
              options={this.getFrequencyOptions()}
              value={frequencyIndex}
              onChange={this.handleFrequencyChange}
            />
          </div>
          {periodicity !== 'DAILY' && (
            <div className="w-50-l w-60-m pt6 pb4">
              <Dropdown
                label={intl.formatMessage(messages.chargeEvery)}
                placeholder={intl.formatMessage(messages.select)}
                options={this.getIntervalOptions()}
                value={purchaseDay ? purchaseDay.toLowerCase() : ''}
                onChange={this.handlePurchaseDayChange}
              />
            </div>
          )}
          <EditionButtons
            isLoading={isLoading}
            onCancel={this.props.onCloseEdit}
            onSave={this.handleSaveClick}
            disabled={isEditDisabled}
          />
        </div>
      </div>
    )
  }
}

interface Frequency {
  periodicity: Periodicity
  interval: number
}

interface ChildProps {
  frequencies: Frequency[]
  loading: boolean
}

interface InnerProps
  extends InjectedIntlProps,
    ChildProps,
    InjectedRuntimeContext {
  updateSettings: (args: {
    variables: MutationUpdateSettingsArgs
  }) => Promise<void>
}

interface OuterProps {
  group: SubscriptionsGroup
  onCloseEdit: () => void
}

type Props = InnerProps & OuterProps

interface State {
  purchaseDay: string | null
  frequencyIndex: number
  isLoading: boolean
  showErrorAlert: boolean
  errorMessage: string
}

export default compose<Props, OuterProps>(
  injectIntl,
  graphql(UPDATE_SETTINGS, { name: 'updateSettings' }),
  queryWrapper<
    OuterProps,
    { frequencies: Frequency[] },
    { subscriptionsGroupId: string },
    ChildProps
  >(INSTANCE, FREQUENCY_OPTIONS, {
    options: ({ group }) => ({
      variables: {
        subscriptionsGroupId: group.id,
      },
    }),
    props: ({ data }) => ({
      frequencies: data?.frequencies && !data.loading ? data.frequencies : [],
      loading: data ? data.loading : false,
    }),
  }),
  branch<InnerProps>((props) => props.loading, renderComponent(DataSkeleton)),
  withRuntimeContext
)(EditData)
