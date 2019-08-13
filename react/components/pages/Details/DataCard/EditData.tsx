import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { Dropdown } from 'vtex.styleguide'
import { ApolloError } from 'apollo-client'

import { WEEK_OPTIONS, MONTH_OPTIONS, TagTypeEnum } from '../../../../constants'
import Alert from '../../../commons/CustomAlert'
import GetFrequencyOptions from '../../../../graphql/getFrequencyOptions.gql'
import UpdateSettings from '../../../../graphql/updateSubscriptionSettings.gql'
import EditButtons from '../EditButtons'
import DataSkeleton from './DataSkeleton'

class EditData extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    const { purchaseSettings, plan } = props.subscriptionsGroup
    const { interval, periodicity } = plan.frequency

    this.state = {
      isLoading: false,
      showErrorAlert: false,
      errorMessage: '',
      chargeDay: purchaseSettings.purchaseDay,
      currentIndex: this.getCurrentFrequencyOption({ periodicity, interval }),
      periodicity,
      interval,
    }
  }

  public getCurrentFrequencyOption({ periodicity, interval }: Frequency) {
    const { frequencyOptions } = this.props.options
    if (!frequencyOptions || !frequencyOptions.length) {
      return 0
    }

    return frequencyOptions.findIndex(
      option =>
        option.periodicity === periodicity && option.interval === interval
    )
  }

  public getFrequencyOptions() {
    const { formatMessage } = this.props.intl
    const { frequencyOptions } = this.props.options

    return frequencyOptions.map((option: Frequency, index: number) => ({
      value: index.toString(),
      label: formatMessage(
        {
          id: `order.subscription.periodicity.${option.periodicity.toLowerCase()}`,
        },
        { count: option.interval }
      ),
    }))
  }

  public getIntervalOptions() {
    const { formatMessage } = this.props.intl
    const { periodicity } = this.state

    if (periodicity === 'WEEKLY') {
      return WEEK_OPTIONS.map(weekDay => ({
        value: weekDay,
        label: formatMessage({
          id: `subscription.periodicity.${weekDay}`,
        }),
      }))
    }

    return MONTH_OPTIONS.map(dayOfMonth => ({
      value: dayOfMonth,
      label: formatMessage(
        { id: 'subscription.select.day' },
        { day: dayOfMonth }
      ),
    }))
  }

  public handleFrequencyChange = (e: any) => {
    const { frequencyOptions } = this.props.options
    const { periodicity, interval } = frequencyOptions[e.target.value]

    this.setState({
      chargeDay: '',
      currentIndex: e.target.value.toString(),
      interval,
      periodicity,
    })
  }

  public handleChargeDayChange = (e: any) => {
    this.setState({ chargeDay: e.target.value })
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.options === this.props.options) {
      return
    }

    this.setState({
      currentIndex: this.getCurrentFrequencyOption(this.state),
    })
  }

  public handleSaveClick = () => {
    this.setState({ isLoading: true })

    this.props
      .updateSettings({
        variables: {
          orderGroup: this.props.subscriptionsGroup.orderGroup,
          purchaseDay: this.state.chargeDay,
          periodicity: this.state.periodicity,
          interval: this.state.interval,
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
    const {
      chargeDay,
      periodicity,
      showErrorAlert,
      errorMessage,
      isLoading,
    } = this.state

    const {
      intl: { formatMessage },
      options: { loading },
    } = this.props

    if (loading) {
      return <DataSkeleton />
    }

    const isEditDisabled = chargeDay === '' && periodicity !== 'DAILY'

    return (
      <div className="card-height h-auto bg-base pa6 ba bw1 b--muted-5">
        <div className="flex flex-row">
          <div className="db-s di-ns b f4 tl c-on-base">
            {formatMessage({ id: 'subscription.data' })}
          </div>
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
              label={formatMessage({ id: 'subscription.data.orderAgain' })}
              options={this.getFrequencyOptions()}
              value={this.state.currentIndex.toString()}
              onChange={this.handleFrequencyChange}
            />
          </div>
          <div className="w-50-l w-60-m pt6 pb4">
            {periodicity !== 'DAILY' && (
              <Dropdown
                label={formatMessage({ id: 'subscription.data.chargeEvery' })}
                placeholder={formatMessage({ id: 'subscription.select' })}
                options={this.getIntervalOptions()}
                value={chargeDay.toLowerCase()}
                onChange={this.handleChargeDayChange}
              />
            )}
          </div>
          <div className="pt4 flex">
            <EditButtons
              isLoading={isLoading}
              onCancel={this.props.onCloseEdit}
              onSave={this.handleSaveClick}
              disabled={isEditDisabled}
            />
          </div>
        </div>
      </div>
    )
  }
}

interface QueryResult {
  frequencyOptions: Frequency[]
  loading: boolean
}

interface Props extends InjectedIntlProps, OutterProps {
  updateSettings: (args: Variables<UpdateSettingsArgs>) => Promise<void>
  options: QueryResult
}

interface OutterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  onCloseEdit: () => void
}

interface State {
  chargeDay: string
  currentIndex: number
  interval: number
  isLoading: boolean
  periodicity: string
  showErrorAlert: boolean
  errorMessage: string
}

const optionsQuery = {
  name: 'options',
  options({ subscriptionsGroup }: OutterProps) {
    return {
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
      },
    }
  },
}

export default compose<Props, OutterProps>(
  injectIntl,
  graphql(GetFrequencyOptions, optionsQuery),
  graphql(UpdateSettings, { name: 'updateSettings' })
)(EditData)
