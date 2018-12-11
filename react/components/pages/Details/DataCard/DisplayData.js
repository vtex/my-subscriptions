import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Button, Alert, Badge } from 'vtex.styleguide'

import ConfirmModal from '../ConfirmModal'
import Toast from '../../../commons/Toast'
import ChargeDayInfo from '../../../ChargeDayInfo'
import FrequencyInfo from '../../../FrequencyInfo'
import LabeledInfo from '../../../LabeledInfo'

class DisplayData extends Component {
  state = {
    isModalOpen: false,
    isLoading: false,
    showAlert: false,
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  handleSuccessUpdate = () => {
    this.setState({
      showAlert: true,
      alertType: 'success',
      alertMessage: 'subscription.edit.success',
      isModalOpen: false,
    })
  }

  handleErrorUpdate = e => {
    this.setState({
      showAlert: true,
      alertType: 'error',
      isModalOpen: false,
      alertMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
        e.graphQLErrors[0].extensions &&
        e.graphQLErrors[0].extensions.error &&
        e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  render() {
    const { subscription, intl, onEdit } = this.props
    const { isModalOpen, showAlert, alertType, alertMessage } = this.state
    return (
      <div className="card-height bw1 bg-base pa6 ba b--muted-5">
        <div>
          {showAlert && (
            <div className="absolute top-2 z-5 ma7">
              {alertType === 'error' ? (
                <Alert
                  type={alertType}
                  autoClose={3000}
                  onClose={this.handleCloseAlert}>
                  {intl.formatMessage({
                    id: `${alertMessage}`,
                  })}
                </Alert>
              ) : (
                <Toast
                  message={intl.formatMessage({
                    id: 'subscription.edit.success',
                  })}
                  onClose={this.handleCloseAlert}
                />
              )}
            </div>
          )}
          {isModalOpen && (
            <ConfirmModal
              isModalOpen={isModalOpen}
              onClose={this.handleCloseModal}
              onSuccessUpdate={this.handleSuccessUpdate}
              onErrorUpdate={this.handleErrorUpdate}
              subscription={subscription}
            />
          )}
          <div className="flex flex-row">
            <div className="db-s di-ns b f4 tl c-on-base">
              {intl.formatMessage({
                id: 'subscription.data',
              })}
            </div>
            <div className="ml-auto">
              <Button size="small" variation="tertiary" onClick={onEdit}>
                <span>
                  {intl.formatMessage({
                    id: 'subscription.actions.edit',
                  })}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex pt5-s pt5-ns w-100-s mr-auto flex-row">
            <div className="mr5 w-50-s w-100-ns">
              <FrequencyInfo
                periodicity={subscription.plan.frequency.periodicity}
                interval={subscription.plan.frequency.interval}
              />
              <div className="pt6">
                <LabeledInfo labelId="subscription.data.initialDate">
                  {intl.formatDate(subscription.plan.validity.begin, {
                    timeZone: 'UTC',
                    style: 'short',
                  })}
                </LabeledInfo>
              </div>
            </div>
            <div className="w-50-s w-100-ns">
              <div className="pl6-s pl0-ns">
                <ChargeDayInfo subscription={subscription} />
              </div>
              <div className="pt6 pl6-s pl0-ns">
                <LabeledInfo labelId="subscription.nextPurchase">
                  <div className="flex flex-row">
                    <span className="db fw3 f5-ns f6-s c-on-base">
                      {intl.formatDate(subscription.nextPurchaseDate, {
                        style: 'short',
                      })}
                    </span>
                    {subscription.isSkipped && (
                      <div className="lh-solid mt1 ml3">
                        <Badge type="warning">
                          {intl.formatMessage({
                            id: 'subscription.skip.confirm',
                          })}
                        </Badge>
                      </div>
                    )}
                  </div>
                </LabeledInfo>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DisplayData.propTypes = {
  subscription: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(DisplayData)
