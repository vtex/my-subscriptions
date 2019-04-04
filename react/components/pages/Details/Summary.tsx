import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { compose } from 'recompose'
import { Button, Modal, withToast } from 'vtex.styleguide'

import updateIsSkipped from '../../../graphql/updateIsSkipped.gql'
import { TagTypeEnum } from '../../../constants'
import Alert from '../../commons/CustomAlert'
import Name from '../../commons/SubscriptionName'
import ItemsImage from '../../commons/ItemsImage'
import SubscriptionsStatus from '../../commons/SubscriptionStatus'
import SubscriptionTotals from './SubscriptionTotals'
import Menu from './Menu'

class Summary extends Component<InnerProps & OutterProps> {
  state = {
    isLoading: false,
    isModalOpen: false,
    showErrorAlert: false,
    errorMessage: '',
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

  handleErrorUpdate = (error: ApolloError) => {
    this.setState({
      showErrorAlert: true,
      errorMessage: `subscription.fetch.${error.graphQLErrors.length > 0 &&
        error.graphQLErrors[0].extensions &&
        error.graphQLErrors[0].extensions.error &&
        error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
    })
  }

  handleSuccessUpdate = () => {
    const { showToast, intl } = this.props

    this.setState({
      isLoading: false,
      isModalOpen: false,
    })

    showToast({
      message: intl.formatMessage({ id: 'subscription.edit.success' }),
    })
  }

  handleCloseErrorAlert = () => {
    this.setState({ showErrorAlert: false })
  }

  render() {
    const { subscriptionsGroup, intl } = this.props
    const { isModalOpen, showErrorAlert, errorMessage } = this.state

    const isPaused = subscriptionsGroup.status === 'PAUSED'

    const options = subscriptionsGroup.isSkipped
      ? ['unskip', 'pause', 'cancel']
      : isPaused
      ? ['restore', 'cancel']
      : ['skip', 'pause', 'cancel']

    const hasMultipleItems = subscriptionsGroup.subscriptions.length > 1

    return (
      <div>
        <Alert
          visible={showErrorAlert}
          type={TagTypeEnum.Error}
          autoClose={3000}
          onClose={this.handleCloseErrorAlert}>
          {errorMessage &&
            intl.formatMessage({
              id: `${errorMessage}`,
            })}
        </Alert>
        <Alert
          visible={subscriptionsGroup.isSkipped}
          type={TagTypeEnum.Warning}>
          {intl.formatMessage({
            id: 'subscription.skip.alert',
          })}
        </Alert>
        <div className="card bw1 bg-base pa6 ba b--muted-5">
          <div className="flex-ns items-center-s items-start-ns">
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
            <div className="pt9-l pt9-m pt4-s ph6-ns flex-grow-1">
              <div className="flex">
                <Name subscriptionGroup={subscriptionsGroup} />
                <div className="pl5-ns pl0-s pt0-ns pt5-s">
                  <SubscriptionsStatus status={subscriptionsGroup.status} />
                </div>
              </div>
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

interface OutterProps {
  subscriptionsGroup: SubscriptionsGroupItemType
}

interface InnerProps extends InjectedIntlProps, RouteComponentProps {
  updateIsSkipped: (args: Variables<UpdateIsSkippedArgs>) => Promise<void>
  showToast: (args: ShowToastArgs) => void
}

export default compose<InnerProps & OutterProps, OutterProps>(
  injectIntl,
  withRouter,
  withToast,
  graphql(updateIsSkipped, isSkippedMutation)
)(Summary)
