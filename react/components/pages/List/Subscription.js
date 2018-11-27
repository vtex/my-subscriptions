import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import { intlShape, injectIntl, FormattedDate } from 'react-intl'
import { Button, Alert, Badge } from 'vtex.styleguide'

import ConfirmModal from './ConfirmModal'
import PaymentDisplay from './PaymentDisplay'
import Price from '../../commons/FormattedPrice'
import Title from '../../commons/Title'
import Toast from '../../commons/Toast'
import ItemsImage from '../../commons/ItemsImage'

class Subscription extends Component {
  state = {
    isRestoreModalOpen: false,
    showSuccessAlert: false,
    showErrorAlert: false,
  }

  handleClick = () => {
    this.props.history.push(
      `/subscriptions/${this.props.subscription.orderGroup}`
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
    const { subscription, intl } = this.props

    if (subscription.items === null) {
      return null
    }
    const {
      isRestoreModalOpen,
      showErrorAlert,
      showSuccessAlert,
      alertMessage,
      alertType,
    } = this.state

    const firstItemOfSubscription = subscription.items[0]
    const isCanceled = firstItemOfSubscription.status === 'CANCELED'
    const isPaused = firstItemOfSubscription.status === 'PAUSED'

    return (
      <div className="pb6">
        {isRestoreModalOpen && (
          <ConfirmModal
            isModalOpen={isRestoreModalOpen}
            onClose={this.handleCloseModal}
            onSuccessUpdate={this.handleSuccessUpdate}
            onErrorUpdate={this.handleSuccessUpdate}
            subscription={subscription}
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
              <ItemsImage items={subscription.items} />
            </div>
            <div className="pt6-l pb6-l pl6-l pt6-m pb6-m pl6-m pt6-s w-100">
              <div className="db b f4 tl c-on-base">
                <span className="mr3">
                  <Title items={subscription.items} />
                </span>
                {isCanceled && (
                  <div className="dib lh-solid">
                    <Badge type="neutral">
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
                      <span className="b db">
                        {intl.formatMessage({
                          id: 'subscription.frequency',
                        })}
                      </span>
                      <span className="db fw3 f5-ns f6-s">
                        {intl.formatMessage({
                          id: `subscription.periodicity.${subscription.plan.frequency.periodicity.toLowerCase()}`,
                        })}
                      </span>
                    </div>
                    {!isCanceled && !isPaused ? (
                      <div className="pl0-ns pt5">
                        <span className="b db">
                          {intl.formatMessage({
                            id: 'subscription.nextPurchase',
                          })}
                        </span>
                        <div className="flex flex-row">
                          <span className="db fw3 f5-ns f6-s">
                            <FormattedDate
                              value={subscription.nextPurchaseDate}
                              style="short"
                            />
                          </span>
                          {subscription.isSkipped && (
                            <div className="lh-solid ml3 mt1">
                              <Badge type="warning">
                                {intl.formatMessage({
                                  id: 'subscription.skip.confirm',
                                })}
                              </Badge>
                            </div>
                          )}
                        </div>
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
                        <span className="b db">
                          {intl.formatMessage({
                            id: 'subscription.payment',
                          })}
                        </span>
                        <div className="f5-ns f6-s pt2 lh-solid dib-ns">
                          <PaymentDisplay
                            purchaseSettings={subscription.purchaseSettings}
                          />
                        </div>
                      </div>
                    )}
                    <div className="pl6-s pl1-ns">
                      <span className="b db">
                        {intl.formatMessage({
                          id: 'subscription.totalValue',
                        })}
                      </span>
                      <span className="db fw3 f5-ns f6-s">
                        <Price
                          value={subscription.totalValue}
                          currency={
                            subscription.purchaseSettings.currencySymbol
                          }
                        />
                      </span>
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

Subscription.propTypes = {
  intl: intlShape.isRequired,
  subscription: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(injectIntl(Subscription))
