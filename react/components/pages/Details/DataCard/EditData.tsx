import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { compose } from 'recompose'
import { Alert, Dropdown } from 'vtex.styleguide'

import GetFrequencyOptions from '../../../../graphql/getFrequencyOptions.gql'
import UpdateSettings from '../../../../graphql/updateSubscriptionSettings.gql'
import EditButtons from '../EditButtons'
import DataSkeleton from './DataSkeleton'

class EditData extends Component<Props,State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      chargeDay: props.subscriptionsGroup.purchaseSettings.purchaseDay,
      chargeDayOptions:
        props.subscriptionsGroup.plan.frequency.periodicity === 'WEEKLY'
          ? WEEK_OPTIONS
          : MONTH_OPTIONS,
      currentIndex:
        (props.options &&
        props.options.frequencyOptions &&
        props.options.frequencyOptions.length > 0) &&
        props.options.frequencyOptions
          .findIndex((option: Frequency) => {
            return (
              option.periodicity ===
                props.subscriptionsGroup.plan.frequency.periodicity &&
              option.interval ===
                props.subscriptionsGroup.plan.frequency.interval
            )
          })
          .toString(),
      interval: props.subscriptionsGroup.plan.frequency.interval,
      isLoading: false,
      periodicity: props.subscriptionsGroup.plan.frequency.periodicity,
      showErrorAlert: false,
    }
  }

  public translateFrequencyOptions(options: Frequency[]) {
    return options.map((option: Frequency, index: number) => ({
      label: this.props.intl.formatMessage(
        {
          id: `subscription.settings.${option.periodicity.toLowerCase()}`,
        },
        { interval: option.interval }
        ),
        value: index.toString(),
    }))
  }

  public translateChargeDayOptions(options: any) {
    return options.map((option: any) => ({
      label: this.props.intl.formatMessage({
        id: `subscription.periodicity.${option.label}`,
      }),
      value: option.value,
    }))
  }

  public handleFrequencyChange = (e: any) => {
    const { frequencyOptions } = this.props.options
    this.setState({
      chargeDay: '',
      chargeDayOptions:
        frequencyOptions[e.target.value].periodicity === 'WEEKLY'
          ? WEEK_OPTIONS
          : MONTH_OPTIONS,
      currentIndex: e.target.value.toString(),
      interval: frequencyOptions[e.target.value].interval,
      periodicity: frequencyOptions[e.target.value].periodicity,
    })
  }

  public handleChargeDayChange = (e:  any) => {
    this.setState({ chargeDay: e.target.value })
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.options !== this.props.options) {
      const { frequencyOptions } = this.props.options
      this.setState({
        currentIndex:
          frequencyOptions &&
          frequencyOptions
            .findIndex(
              option =>
                option.periodicity === this.state.periodicity &&
                option.interval === this.state.interval
            )
            .toString(),
      })
    }
  }

  public handleSaveClick = () => {
    this.setState({ isLoading: true })
    this.props
      .udpateSettings({
        variables: {
          orderGroup: this.props.subscriptionsGroup.orderGroup,
          purchaseDay: this.state.chargeDay,
          periodicity: this.state.periodicity,
          interval: this.state.interval,
        },
      })
      .then(() => {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            this.props.onSave()
          }
        )
      })
      .catch(error => {
        const errorMessage =
          error.graphQLErrors.length > 0 &&
          error.graphQLErrors[0].extensions &&
          error.graphQLErrors[0].extensions.statusCode &&
          error.graphQLErrors[0].extensions.statusCode.toLowerCase()

        this.setState({
          isLoading: false,
          showErrorAlert: true,
          errorMessage:
            (errorMessage && `subscription.fetch.${errorMessage}`) ||
            'global.unknownError',
        })
      })
  }

  public render() {
    const {
      chargeDay,
      chargeDayOptions,
      periodicity,
      showErrorAlert,
      errorMessage,
      isLoading,
    } = this.state

    const { frequencyOptions, loading } = this.props.options

    if (loading) {
      return <DataSkeleton />
    }

    const isDisabled = chargeDay === '' && periodicity !== 'DAILY'

    return (
      <div className="card-height h-auto bg-base pa6 ba bw1 b--muted-5">
        <div className="flex flex-row">
          <div className="db-s di-ns b f4 tl c-on-base">
            {this.props.intl.formatMessage({
              id: 'subscription.data',
            })}
          </div>
        </div>
        <div className="flex pt5 w-100-s mr-auto flex-column">
          {showErrorAlert && (
            <div className="mb5">
              <Alert
                type="error"
                autoClose={3000}
                onClose={() => this.setState({ showErrorAlert: false })}>
                {this.props.intl.formatMessage({
                  id: `${errorMessage}`,
                })}
              </Alert>
            </div>
          )}
          <div className="w-40-l w-60-m w-100-s">
            <Dropdown
              label={this.props.intl.formatMessage({
                id: 'subscription.data.orderAgain',
              })}
              options={this.translateFrequencyOptions(frequencyOptions)}
              value={this.state.currentIndex}
              onChange={this.handleFrequencyChange}
            />
          </div>
          <div className="w-40-l w-60-m pt6 pb4">
            {periodicity !== 'DAILY' && (
              <Dropdown
                label={this.props.intl.formatMessage({
                  id: 'subscription.data.chargeDay',
                })}
                options={
                  periodicity === 'WEEKLY'
                    ? this.translateChargeDayOptions(chargeDayOptions)
                    : chargeDayOptions
                }
                value={chargeDay}
                onChange={this.handleChargeDayChange}
              />
            )}
          </div>
            <div className="pt4 flex">
              <EditButtons
                isLoading={isLoading}
                onCancel={this.props.onCloseEdit}
                onSave={this.handleSaveClick}
                disabled={isDisabled}
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
  udpateSettings: (args: MutationArgs<UpdateSettingsArgs>) => Promise<void>,
  options: QueryResult
}

interface OutterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
  onCloseEdit: () => void
}

interface State {
  chargeDay: string
  chargeDayOptions: string
  currentIndex: string | undefined,
  interval: number,
  isLoading: boolean,
  periodicity: string,
  showErrorAlert: boolean,
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
