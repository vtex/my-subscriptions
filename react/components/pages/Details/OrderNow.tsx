import React, { Component } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { graphql } from 'react-apollo'
import { compose, branch, renderNothing } from 'recompose'
import { Button } from 'vtex.styleguide'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'

import { CSS, SubscriptionStatusEnum } from '../../../constants'
import ADD_TO_CART from '../../../graphql/addToCart.gql'
import ORDER_FORM_ID from '../../../graphql/orderFormId.gql'
import Modal from '../../commons/ConfirmationModal'

class SubscriptionOrderNowContainer extends Component<
  InnerProps & OutterProps
> {
  state = {
    isModalOpen: false,
  }

  handleOpenModal = () => this.setState({ isModalOpen: true })

  handleCloseModal = () => this.setState({ isModalOpen: false })

  handleSubmit = () => {
    const { orderFormId, addToCart, subscriptions } = this.props
    const items = subscriptions.map(subscription => ({
      quantity: subscription.quantity,
      id: parseInt(subscription.sku.SkuId, 10),
      seller: '1',
      index: 1,
    }))
    const variables = {
      orderFormId,
      items,
    }

    debugger
    return addToCart({ variables }).then(() => {
      window.location.href = '/checkout/'
    })
  }

  render() {
    const { intl, shippingEstimate } = this.props

    return (
      <div className={`${CSS.cardWrapper} mb9 flex`}>
        <Modal
          onSubmit={this.handleSubmit}
          isModalOpen={this.state.isModalOpen}
          onCloseModal={this.handleCloseModal}
          errorMessage={intl.formatMessage({
            id: 'subscription.fetch.servererror',
          })}
          confirmationLabel={intl.formatMessage({
            id: 'subscription.order.again.confirmation',
          })}
          cancelationLabel={intl.formatMessage({
            id: 'subscription.editition.cancel',
          })}>
          {intl.formatMessage({ id: 'subscription.order.again.description' })}
        </Modal>
        <div className="w-70">
          <div className="flex">
            <span className="t-heading-5 c-on-base">
              {intl.formatMessage({ id: 'subscription.order.again.title' })}
            </span>
          </div>
          <div className="mt4">
            <span className="t-small c-muted-1">
              {intl.formatMessage({ id: 'subscription.next.purchase' })}
              <TranslateEstimate shippingEstimate={shippingEstimate} />
            </span>
          </div>
        </div>
        <div className="w-30 flex justify-end">
          <Button onClick={this.handleOpenModal}>
            {intl.formatMessage({ id: 'subscription.order.again.button' })}
          </Button>
        </div>
      </div>
    )
  }
}

interface InnerProps extends InjectedIntlProps {
  addToCart: (args: Variables<AddToCarArgs>) => Promise<void>
  orderFormId: string
}

interface OutterProps {
  subscriptionStatus: SubscriptionStatusEnum
  subscriptions: SubscriptionType[]
  shippingEstimate: string
}

const enhance = compose<InnerProps & OutterProps, OutterProps>(
  branch(
    ({ subscriptionStatus }: OutterProps) =>
      subscriptionStatus !== SubscriptionStatusEnum.Active,
    renderNothing
  ),
  injectIntl,
  graphql(ADD_TO_CART, { name: 'addToCart' }),
  graphql(ORDER_FORM_ID, {
    props: ({ data }: any) => ({
      orderFormId: data && data.orderForm && data.orderForm.orderFormId,
    }),
  }),
  branch(({ orderFormId }: InnerProps) => !orderFormId, renderNothing)
)

export default enhance(SubscriptionOrderNowContainer)
