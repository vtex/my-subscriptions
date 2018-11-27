import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { compose, graphql } from 'react-apollo'
import { Button, Alert } from 'vtex.styleguide'
import { utils } from 'vtex.my-account-commons'

import RemoveItemConfirmModal from './RemoveItemConfirmModal'
import Price from '../../commons/FormattedPrice'
import Toast from '../../commons/Toast'
import RemoveItem from '../../../graphql/removeItem.gql'

const { fixImageUrl } = utils

class Item extends Component {
  state = {
    isLoading: false,
    isModalOpen: false,
    showAlert: false,
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false })
  }

  handleRemoveItem = () => {
    this.setState({ isLoading: true })
    this.props
      .removeItem({
        variables: {
          subscriptionId: this.props.subscriptionId,
          itemId: this.props.item.SubscriptionId,
        },
      })
      .then(() => {
        this.setState({
          isLoading: false,
          isModalOpen: false,
          showAlert: true,
          alertType: 'success',
          alertMessage: 'subscription.edit.success',
        })
      })
      .catch(e => {
        this.setState({
          showAlert: true,
          isLoading: false,
          isModalOpen: false,
          alertType: 'error',
          errorMessage: `subscription.fetch.${e.graphQLErrors.length > 0 &&
            e.graphQLErrors[0].extensions &&
            e.graphQLErrors[0].extensions.error &&
            e.graphQLErrors[0].extensions.error.statusCode.toLowerCase()}`,
        })
      })
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false })
  }

  render() {
    const { item, currency, intl } = this.props
    const {
      isModalOpen,
      isLoading,
      showAlert,
      alertType,
      alertMessage,
    } = this.state
    return (
      <div>
        {showAlert && alertType === 'error' && (
          <div className="absolute top-2 z-5 ma7">
            <Alert
              type={alertType}
              autoClose={3000}
              onClose={this.handleCloseAlert}>
              {intl.formatMessage({
                id: `${alertMessage}`,
              })}
            </Alert>
          </div>
        )}
        {showAlert && alertType === 'success' && (
          <Toast
            onClose={this.handleCloseAlert}
            message={intl.formatMessage({
              id: `${alertMessage}`,
            })}
          />
        )}
        <div className="card center bg-base center pa0-ns mb5 subscription__product-listing__card pa6 ba bw1 b--muted-5">
          {isModalOpen && (
            <RemoveItemConfirmModal
              onClose={this.handleCloseModal}
              onSave={this.handleRemoveItem}
              isModalOpen={isModalOpen}
              isLoading={isLoading}
            />
          )}
          <div className="flex-ns items-center-s items-start-ns">
            <div className="br-ns flex-none product-vertical-line bw1-ns b--muted-5">
              <img
                className="db-s center di-ns pt6-ns pl8-ns"
                src={fixImageUrl(item.sku.imageUrl, 90, 100)}
              />
            </div>
            <div className="pt5-l pt3-s pl6-m w-100">
              <div className="db b f4 tl c-on-base">
                <a
                  className="c-on-base"
                  target="_blank"
                  href={item.sku.detailUrl}>
                  <span className="mr3 underline">{item.sku.name}</span>
                </a>
              </div>
              <div className="flex pt3-s pt0-ns w-100 mr-auto flex-column-s flex-row-ns">
                <div className="flex flex-row w-100">
                  <div className="w-50-s w-third-ns">
                    <div className="pl0-ns pt5">
                      <span className="b db">
                        {intl.formatMessage({
                          id: 'subscription.item.quantity',
                        })}
                      </span>
                      <span className="db fw3 f5-ns f6-s">{item.quantity}</span>
                    </div>
                  </div>
                  <div className="w-50-s w-third-ns">
                    <div className="pl6-s pl1-ns pt5">
                      <span className="b db">
                        {intl.formatMessage({
                          id: 'subscription.totalValue',
                        })}
                      </span>
                      <span className="db fw3 f5-ns f6-s">
                        <Price
                          value={item.sku.priceAtSubscriptionDate}
                          currency={currency}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt4 pr6-ns pr0-s flex justify-end-ns justify-center-s">
                  <div className="pt1-ns pt5-s">
                    <Button
                      size="small"
                      onClick={this.handleOpenModal}
                      variation="secondary">
                      <span>
                        {intl.formatMessage({
                          id: 'subscription.actions.remove',
                        })}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const removeItemMutation = {
  name: 'removeItem',
}

Item.propTypes = {
  intl: intlShape.isRequired,
  removeItem: PropTypes.func.isRequired,
  subscriptionId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
}

export default compose(graphql(RemoveItem, removeItemMutation))(
  injectIntl(Item)
)
