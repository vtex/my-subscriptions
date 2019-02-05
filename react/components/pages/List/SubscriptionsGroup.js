import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { intlShape, injectIntl, FormattedDate } from 'react-intl'
import { Button, Alert, Badge } from 'vtex.styleguide'

import ConfirmModal from './ConfirmModal'
import PaymentDisplay from './PaymentDisplay'
import FrequencyInfo from '../../FrequencyInfo'
import LabeledInfo from '../../LabeledInfo'
import Price from '../../commons/FormattedPrice'
import Title from '../../commons/Title'
import Toast from '../../commons/Toast'
import ItemsImage from '../../commons/ItemsImage'

class SubscriptionsGroup extends Component {
  state = {
    isRestoreModalOpen: false,
    showSuccessAlert: false,
    showErrorAlert: false,
  }

  handleClick = () => {
    this.props.history.push(
      `/subscriptions/${this.props.subscriptionsGroup.orderGroup}`
    )
  }

  handleRestore = () => {
    this.setState({ isRestoreModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isRestoreModalOpen: false })
  }

  handleSuccessUpdate = () => {
    this.setState({
      showSuccessAlert: true,
      alertType: 'success',
      alertMessage: 'subscription.edit.success',
      isRestoreModalOpen: false,
    })
  }

  handleErrorUpdate = e => {
    this.setState({
      showErrorAlert: true,
      alertType: 'error',
      isRestoreModalOpen: false,
      alertMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
        e.graphQLErrors[0].extensions &&
        e.graphQLErrors[0].extensions.error &&
        e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleCloseErrorAlert = () => {
    this.setState({ showErrorAlert: false })
  }

  handleCloseSuccessAlert = () => {
    this.setState({ showSuccessAlert: false })
  }

  render() {
    const { subscriptionsGroup, intl } = this.props

    const {
      isRestoreModalOpen,
      showErrorAlert,
      showSuccessAlert,
      alertMessage,
      alertType,
    } = this.state

    const isCanceled = subscriptionsGroup.status === 'CANCELED'
    const isPaused = subscriptionsGroup.status === 'PAUSED'

    return (
      <div className="pb6">
        {isRestoreModalOpen && (
          <ConfirmModal
            isModalOpen={isRestoreModalOpen}
            onClose={this.handleCloseModal}
            onSuccessUpdate={this.handleSuccessUpdate}
            onErrorUpdate={this.handleSuccessUpdate}
            subscriptionGroup={subscriptionsGroup}
          />
        )}
        {showErrorAlert && (
          <div className="absolute top-2 z-5 ma7">
            <Alert
              type={alertType}
              autoClose={3000}
              onClose={this.handleCloseErrorAlert}>
              {intl.formatMessage({
                id: `${alertMessage}`,
              })}
            </Alert>
          </div>
        )}
        {showSuccessAlert && (
          <div className="absolute top-2 z-5 ma7">
            <Toast
              message={intl.formatMessage({
                id: 'subscription.edit.success',
              })}
              onClose={this.handleCloseSuccessAlert}
            />
          </div>
        )}

        <div className="card ba bw1 bg-base center subscription__listing-card pa0-ns pa6-s ba bw1 b--muted-5">
          <div className="flex-ns items-center-s items-start-ns">
            <div className="myo-subscription__image-size  br-ns flex-none bw1-ns b--muted-5">
              <ItemsImage items={subscriptionsGroup.subscriptions} />
            </div>
            <div className="pt6-l pb6-l pl6-l pt6-m pb6-m pl6-m pt6-s w-100">
              <div className="db b f4 tl c-on-base">
                <span className="mr3">
                  <Title items={subscriptionsGroup.subscriptions} />
                </span>
                {isCanceled && (
                  <div className="dib lh-solid">
                    <Badge>
                      {intl.formatMessage({
                        id: 'subscription.canceled',
                      })}
                    </Badge>
                  </div>
                )}
                {isPaused && (
                  <div className="dib lh-solid">
                    <Badge type="error">
                      {intl.formatMessage({
                        id: 'subscription.paused',
                      })}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex pt3-s pt0-ns w-100 mr-auto flex-column-s flex-row-ns">
                <div className="flex flex-row w-100 mr6-s mr0-m ">
                  <div className="w-50 pt6 mr6 c-on-base">
                    <div className="pl0-ns">
                      <FrequencyInfo
                        periodicity={
                          subscriptionsGroup.plan.frequency.periodicity
                        }
                        interval={subscriptionsGroup.plan.frequency.interval}
                      />
                    </div>
                    {!isCanceled && !isPaused ? (
                      <div className="pl0-ns pt5">
                        <LabeledInfo labelId="subscription.nextPurchase">
                          <div className="flex flex-row">
                            <span className="db fw3 f5-ns f6-s">
                              <FormattedDate
                                value={subscriptionsGroup.nextPurchaseDate}
                                style="short"
                              />
                            </span>
                            {subscriptionsGroup.isSkipped && (
                              <div className="lh-solid ml3 mt1">
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
                    ) : isPaused && !isCanceled ? (
                      <MediaQuery minWidth={640}>
                        <div className="pt6">
                          <Button
                            size="small"
                            onClick={this.handleRestore}
                            variation="primary">
                            <span>
                              {intl.formatMessage({
                                id: 'subscription.actions.restart',
                              })}
                            </span>
                          </Button>
                        </div>
                      </MediaQuery>
                    ) : null}
                  </div>
                  <div className="w-50 pt6 c-on-base">
                    {!isCanceled && (
                      <div className="pl6-s pl1-ns pb5">
                        <LabeledInfo labelId="subscription.payment">
                          <PaymentDisplay
                            purchaseSettings={
                              subscriptionsGroup.purchaseSettings
                            }
                          />
                        </LabeledInfo>
                      </div>
                    )}
                    <div className="pl6-s pl1-ns">
                      <LabeledInfo labelId="subscription.totalValue">
                        <Price
                          value={subscriptionsGroup.totalValue}
                          currency={
                            subscriptionsGroup.purchaseSettings.currencySymbol
                          }
                        />
                      </LabeledInfo>
                    </div>
                  </div>
                </div>
                <div className="w-100-s flex-column justify-end-ns w-50-ns pt6">
                  {isPaused && !isCanceled ? (
                    <div>
                      <MediaQuery maxWidth={640}>
                        <div className="pt6 flex justify-center">
                          <Button
                            block
                            size="small"
                            onClick={this.handleRestore}
                            variation="primary">
                            <span>
                              {intl.formatMessage({
                                id: 'subscription.actions.restart',
                              })}
                            </span>
                          </Button>
                        </div>
                        <div className="pt4 pr6-ns pr0-s flex justify-center">
                          <Button
                            block
                            size="small"
                            onClick={this.handleClick}
                            variation="secondary">
                            <span>
                              {intl.formatMessage({
                                id: 'subscription.seeDetails',
                              })}
                            </span>
                          </Button>
                        </div>
                      </MediaQuery>
                      <MediaQuery minWidth={640}>
                        <div className="pt4 pr6-ns pr0-s flex justify-end">
                          <Button
                            size="small"
                            onClick={this.handleClick}
                            variation="secondary">
                            <span>
                              {intl.formatMessage({
                                id: 'subscription.seeDetails',
                              })}
                            </span>
                          </Button>
                        </div>
                      </MediaQuery>
                    </div>
                  ) : (
                    <div className="pt4 pr6-l pr4-m pr0-s flex justify-end-ns justify-center-s">
                      <Button
                        size="small"
                        onClick={this.handleClick}
                        variation="secondary">
                        <span>
                          {intl.formatMessage({
                            id: 'subscription.seeDetails',
                          })}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SubscriptionsGroup.propTypes = {
  intl: intlShape.isRequired,
  subscriptionsGroup: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(injectIntl(SubscriptionsGroup))