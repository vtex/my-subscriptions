import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import ReactRouterPropTypes from 'react-router-prop-types'
import { compose, graphql } from 'react-apollo'
import { Alert, Button, Modal, Badge } from 'vtex.styleguide'

import { subscriptionsGroupShape } from '../../../proptypes'
import updateIsSkipped from '../../../graphql/updateIsSkipped.gql'
import Title from '../../commons/Title'
import Toast from '../../commons/Toast'
import ItemsImage from '../../commons/ItemsImage'
import SubscriptionTotals from './SubscriptionTotals'
import Menu from './Menu'

class Summary extends Component {
  state = {
    isLoading: false,
    isModalUpdateIOpen: false,
    showErrorAlert: false,
    showSuccessAlert: false,
  }

  handleClick = () => {
    const { subscriptionsGroup, history } = this.props

    history.push({
      pathname: `${subscriptionsGroup.orderGroup}/products`,
    })
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  handleConfirmSkip = () => {
    this.setState({ isLoading: true })
    this.props
      .updateIsSkipped({
        variables: {
          orderGroup: this.props.subscriptionsGroup.orderGroup,
          isSkipped: !this.props.subscriptionsGroup.isSkipped,
        },
      })
      .then(() => {
        this.handleSuccessUpdate()
      })
      .catch(error => {
        this.handleErrorUpdate(error)
      })
  }

  handleErrorUpdate = error => {
    this.setState({
      showErrorAlert: true,
      errorMessage: `subscription.fetch.${error.graphQLErrors.length > 0 &&
        error.graphQLErrors[0].extensions &&
        error.graphQLErrors[0].extensions.error &&
        error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleSuccessUpdate = () => {
    this.setState({
      isLoading: false,
      isModalOpen: false,
      showSuccessAlert: true,
    })
  }

  handleCloseErrorAlert = () => {
    this.setState({ showErrorAlert: false })
  }

  render() {
    const { subscriptionsGroup, intl } = this.props
    const {
      isModalOpen,
      showSuccessAlert,
      showErrorAlert,
      errorMessage,
    } = this.state

    const isCanceled = subscriptionsGroup.status === 'CANCELED'
    const isPaused = subscriptionsGroup.status === 'PAUSED'

    const options = subscriptionsGroup.isSkipped
      ? ['unskip', 'pause', 'cancel']
      : isPaused
      ? ['restore', 'cancel']
      : ['skip', 'pause', 'cancel']

    const hasMultipleItems = subscriptionsGroup.subscriptions.length > 1

    return (
      <div>
        {showErrorAlert && (
          <div className="mb5">
            <Alert
              type="error"
              autoClose={3000}
              onClose={this.handleCloseErrorAlert}>
              {intl.formatMessage({
                id: `${errorMessage}`,
              })}
            </Alert>
          </div>
        )}
        {subscriptionsGroup.isSkipped && (
          <div className="mb5">
            <Alert type="warning">
              {intl.formatMessage({
                id: 'subscription.skip.alert',
              })}
            </Alert>
          </div>
        )}
        <div className="card bw1 bg-base pa6 ba b--muted-5">
          <div className="flex-ns items-center-s items-start-ns">
            {showSuccessAlert && (
              <Toast
                message={intl.formatMessage({
                  id: 'subscription.edit.success',
                })}
                onClose={this.handleCloseSuccessAlert}
              />
            )}
            {isModalOpen && (
              <Modal
                centered
                isOpen={isModalOpen}
                onClose={this.handleCloseModal}>
                <span className="db b f5">
                  {intl.formatMessage({
                    id: subscriptionsGroup.isSkipped
                      ? 'subscription.unskip.title'
                      : 'subscription.skip.title',
                  })}
                </span>
                <span className="db pt6">
                  {intl.formatMessage({
                    id: subscriptionsGroup.isSkipped
                      ? 'subscription.unskip.text'
                      : 'subscription.skip.text',
                  })}
                </span>
                <div className="flex flex-row justify-end mt7">
                  <span className="mr4">
                    <Button
                      size="small"
                      variation="tertiary"
                      onClick={this.handleCloseModal}>
                      {intl.formatMessage({ id: 'commons.cancel' })}
                    </Button>
                  </span>
                  <Button
                    size="small"
                    variation="primary"
                    isLoading={this.state.isLoading}
                    onClick={this.handleConfirmSkip}>
                    {intl.formatMessage({
                      id: subscriptionsGroup.isSkipped
                        ? 'subscription.unskip.confirm'
                        : 'subscription.skip.confirm',
                    })}
                  </Button>
                </div>
              </Modal>
            )}
            <div className="flex flex-column">
              <div>
                <span className="mb4 db b f4 tl c-on-base">
                  {intl.formatMessage({
                    id: 'subscription.summary',
                  })}
                </span>
              </div>
              <div className="pt5">
                <div className="myo-subscription__image-size relative items-center ba-ns bw1-ns b--muted-5">
                  <ItemsImage items={subscriptionsGroup.subscriptions} />
                </div>
              </div>
            </div>
            <div className="pt9-l pt9-m pt4-s pl6-ns flex-grow-1">
              <span className="db b f4 tl c-on-base">
                <Title items={subscriptionsGroup.subscriptions} />
                {isCanceled && (
                  <div className="ml4 dib lh-solid">
                    <Badge type="neutral">
                      {intl.formatMessage({
                        id: 'subscription.canceled',
                      })}
                    </Badge>
                  </div>
                )}
                {isPaused && (
                  <div className="ml4 dib lh-solid">
                    <Badge type="error">
                      {intl.formatMessage({
                        id: 'subscription.paused',
                      })}
                    </Badge>
                  </div>
                )}
              </span>
              <div className="w-100 flex flex-row-ns flex-column-s flex-wrap mw6">
                <div className="w-100 pt5">
                  {!hasMultipleItems && (
                    <div className="cf pt2">
                      <div className="dib f6 fw4 c-muted-1 w-40">
                        {intl.formatMessage({
                          id: 'subscription.summary.quantity',
                        })}
                      </div>
                      <div className="dib f6 fw4 c-muted-1 tr w-60">
                        {subscriptionsGroup.subscriptions[0].quantity}
                      </div>
                    </div>
                  )}
                  <SubscriptionTotals
                    totals={subscriptionsGroup.totals}
                    currencyCode={
                      subscriptionsGroup.purchaseSettings.currencySymbol
                    }
                  />
                </div>
                <div className="w-100 flex flex-column justify-center-s justify-end-ns items-center pt6-s pt2-ns">
                  {hasMultipleItems && (
                    <Button
                      size="small"
                      block
                      onClick={this.handleClick}
                      variation="secondary">
                      <span>
                        {intl.formatMessage({
                          id: 'subscription.seeProducts',
                        })}
                      </span>
                    </Button>
                  )}
                  <Menu
                    options={options}
                    onSkipOrUnskip={this.handleOpenModal}
                    onSuccessUpdate={this.handleSuccessUpdate}
                    onErrorUpdate={this.handleErrorUpdate}
                    subscriptionsGroup={subscriptionsGroup}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const isSkippedMutation = {
  name: 'updateIsSkipped',
}

Summary.propTypes = {
  item: PropTypes.object,
  updateIsSkipped: PropTypes.func.isRequired,
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  originalOrderId: PropTypes.string,
  intl: intlShape.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

export default compose(graphql(updateIsSkipped, isSkippedMutation))(
  withRouter(injectIntl(Summary))
)
