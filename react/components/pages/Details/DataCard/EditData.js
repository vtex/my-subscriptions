import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import { Dropdown, Alert } from 'vtex.styleguide'

import DataSkeleton from './DataSkeleton'
import EditButtons from '../EditButtons'
import { MONTH_OPTIONS, WEEK_OPTIONS } from '../../../../constants'
import GetFrequencyOptions from '../../../../graphql/getFrequencyOptions.gql'
import UpdateSettings from '../../../../graphql/updateSubscriptionSettings.gql'
import { subscriptionsGroupShape } from '../../../../proptypes'

class EditData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      periodicity: props.subscriptionsGroup.plan.frequency.periodicity,
      interval: props.subscriptionsGroup.plan.frequency.interval,
      chargeDay: props.subscriptionsGroup.purchaseSettings.purchaseDay,
      chargeDayOptions:
        props.subscriptionsGroup.plan.frequency.periodicity === 'WEEKLY'
          ? WEEK_OPTIONS
          : MONTH_OPTIONS,
      isLoading: false,
      showErrorAlert: false,
      currentIndex:
        props.options &&
        props.options.frequencyOptions &&
        props.options.frequencyOptions.length > 0 &&
        props.options.frequencyOptions
          .findIndex(option => {
            return (
              option.periodicity ===
                props.subscriptionsGroup.plan.frequency.periodicity &&
              option.interval ===
                props.subscriptionsGroup.plan.frequency.interval
            )
          })
          .toString(),
    }
  }

  translateFrequencyOptions(options) {
    return options.map((option, index) => ({
      value: index.toString(),
      label: this.props.intl.formatMessage(
        {
          id: `subscription.settings.${option.periodicity.toLowerCase()}`,
        },
        { interval: option.interval }
      ),
    }))
  }

  translateChargeDayOptions(options) {
    return options.map(option => ({
      value: option.value,
      label: this.props.intl.formatMessage({
        id: `subscription.periodicity.${option.label}`,
      }),
    }))
  }

  handleFrequencyChange = e => {
    const { frequencyOptions } = this.props.options
    this.setState({
      currentIndex: e.target.value.toString(),
      periodicity: frequencyOptions[e.target.value].periodicity,
      interval: frequencyOptions[e.target.value].interval,
      chargeDay: '',
      chargeDayOptions:
        frequencyOptions[e.target.value].periodicity === 'WEEKLY'
          ? WEEK_OPTIONS
          : MONTH_OPTIONS,
    })
  }

  handleChargeDayChange = e => {
    this.setState({ chargeDay: e.target.value })
  }

  componentDidUpdate(prevProps) {
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

  handleSaveClick = () => {
    this.setState({ isLoading: true })
    this.props
      .updateSettings({
        variables: {
          subscriptionId: this.props.subscriptionsGroup.orderGroup,
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

  render() {
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
          <MediaQuery minWidth={1024}>
            <EditButtons
              isLoading={isLoading}
              onCancel={this.props.onCancel}
              onSave={this.handleSaveClick}
              disabled={isDisabled}
            />
          </MediaQuery>
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
          <MediaQuery maxWidth={1023}>
            <div className="pt4 flex">
              <EditButtons
                isLoading={isLoading}
                onCancel={this.props.onCancel}
                onSave={this.handleSaveClick}
                disabled={isDisabled}
              />
            </div>
          </MediaQuery>
        </div>
      </div>
    )
  }
}

EditData.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  intl: intlShape.isRequired,
  options: PropTypes.shape({
    frequencyOptions: PropTypes.arrayOf(
      PropTypes.shape({
        interval: PropTypes.number.isRequired,
        periodicity: PropTypes.string.isRequired,
      })
    ),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
}

const optionsQuery = {
  name: 'options',
  options({ subscriptionsGroup }) {
    return {
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
      },
    }
  },
}

export default compose(
  graphql(GetFrequencyOptions, optionsQuery),
  graphql(UpdateSettings, { name: 'updateSettings' })
)(injectIntl(EditData))
