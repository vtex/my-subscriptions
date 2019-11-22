import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose, branch, renderComponent } from 'recompose'
import { ApolloError } from 'apollo-client'
import { Dropdown } from 'vtex.styleguide'
import {
  MutationUpdateSettingsArgs,
  Periodicity as GraphQLPeriodicity,
} from 'vtex.subscriptions-graphql'

import {
  WEEK_OPTIONS,
  MONTH_OPTIONS,
  TagTypeEnum,
  CSS,
  BASIC_CARD_WRAPPER,
  Periodicity,
} from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import FREQUENCY_OPTIONS from '../../../../graphql/frequencyOptions.gql'
import UPDATE_SETTINGS from '../../../../graphql/updateSubscriptionSettings.gql'
import EditionButtons from '../EditionButtons'

import DataSkeleton from './DataSkeleton'

import { SubscriptionsGroup } from '..'

class EditData extends Component<Props, State> {
  public constructor(props: Props) {
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
      option =>
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
      label: intl.formatMessage(
        {
          id: `order.subscription.periodicity.${frequency.periodicity.toLowerCase()}`,
        },
        { count: frequency.interval }
      ),
    }))
  }

  private getIntervalOptions() {
    const { intl } = this.props
    const { periodicity } = this.getCurrentFrequency()

    if (periodicity === Periodicity.Weekly) {
      return WEEK_OPTIONS.map(weekDay => ({
        value: weekDay,
        label: intl.formatMessage({
          id: `subscription.periodicity.${weekDay}`,
        }),
      }))
    }

    return MONTH_OPTIONS.map(dayOfMonth => ({
      value: dayOfMonth,
      label: intl.formatMessage(
        { id: 'subscription.select.day' },
        { day: dayOfMonth }
      ),
    }))
  }

  private handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      purchaseDay: '',
      frequencyIndex: parseInt(e.target.value),
    })
  }

  public handlePurchaseDayChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ purchaseDay: e.target.value })

  public handleSaveClick = () => {
    const { purchaseDay } = this.state
    const { periodicity, interval } = this.getCurrentFrequency()

    this.setState({ isLoading: true })

    this.props
      .updateSettings({
        variables: {
          subscriptionsGroupId: this.props.group.id,
          purchaseDay,
          periodicity: (periodicity as unknown) as GraphQLPeriodicity,
          interval,
        },
      })
      .then(() => {
        this.setState({ isLoading: false })
        this.props.onCloseEdit()
      })
      .catch((error: ApolloError) => {
        const errorCode =
          error.graphQLErrors.length > 0 &&
          error.graphQLErrors[0].extensions &&
          error.graphQLErrors[0].extensions.statusCode &&
          error.graphQLErrors[0].extensions.statusCode.toLowerCase()

        const errorMessage = errorCode
          ? `subscription.fetch.${errorCode}`
          : 'global.unknownError'

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

    const isEditDisabled =
      purchaseDay === '' && periodicity !== Periodicity.Daily

    return (
      <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({ id: 'subscription.data' })}
        </div>
        <div className="flex pt5 w-100-s mr-auto flex-column">
          <Alert
            visible={showErrorAlert}
            type={TagTypeEnum.Error}
            onClose={() => this.setState({ showErrorAlert: false })}
            contentId={errorMessage}
          />
          <div className="w-50-l w-60-m w-100-s">
            <Dropdown
              label={intl.formatMessage({ id: 'subscription.data.orderAgain' })}
              options={this.getFrequencyOptions()}
              value={frequencyIndex}
              onChange={this.handleFrequencyChange}
            />
          </div>
          {periodicity !== Periodicity.Daily && (
            <div className="w-50-l w-60-m pt6 pb4">
              <Dropdown
                label={intl.formatMessage({
                  id: 'subscription.data.chargeEvery',
                })}
                placeholder={intl.formatMessage({ id: 'subscription.select' })}
                options={this.getIntervalOptions()}
                value={purchaseDay.toLowerCase()}
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

interface InnerProps extends InjectedIntlProps, ChildProps {
  updateSettings: (args: {
    variables: MutationUpdateSettingsArgs
  }) => Promise<void>
}

interface OutterProps {
  group: SubscriptionsGroup
  onCloseEdit: () => void
}

type Props = InnerProps & OutterProps

interface State {
  purchaseDay: string
  frequencyIndex: number
  isLoading: boolean
  showErrorAlert: boolean
  errorMessage: string
}

export default compose<Props, OutterProps>(
  injectIntl,
  graphql(UPDATE_SETTINGS, { name: 'updateSettings' }),
  graphql<
    OutterProps,
    { frequencies: Frequency[] },
    { subscriptionsGroupId: string },
    ChildProps
  >(FREQUENCY_OPTIONS, {
    options: ({ group }) => ({
      variables: {
        subscriptionsGroupId: group.id,
      },
    }),
    props: ({ data }) => ({
      frequencies:
        data && data.frequencies && !data.loading ? data.frequencies : [],
      loading: data ? data.loading : false,
    }),
  }),
  branch<InnerProps>(props => props.loading, renderComponent(DataSkeleton))
)(EditData)
