import React, { Component } from 'react'
import { defineMessages, FormattedMessage, FormattedDate } from 'react-intl'
import { Box, Button } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { Subscription } from '../../graphql/queries/detailsPage.gql'
import { SubscriptionAction } from './utils'

defineMessages({
  restoreLabel: {
    id: 'store/details-page.action-bar.label.restore',
  },
  restoreBody: {
    id: 'store/details-page.action-bar.text.restore',
  },
  restoreButton: {
    id: 'store/details-page.action-bar.button.restore',
  },
  unskipLabel: {
    id: 'store/details-page.action-bar.label.unskip',
  },
  unskipBody: {
    id: 'store/details-page.action-bar.text.unskip',
  },
  unskipButton: {
    id: 'store/details-page.action-bar.button.unskip',
  },
  changeAddressLabel: {
    id: 'store/details-page.action-bar.label.changeAddress',
  },
  changeAddressBody: {
    id: 'store/details-page.action-bar.text.changeAddress',
  },
  changeAddressButton: {
    id: 'store/details-page.action-bar.button.changeAddress',
  },
  changePaymentLabel: {
    id: 'store/details-page.action-bar.label.changePayment',
  },
  changePaymentBody: {
    id: 'store/details-page.action-bar.text.changePayment',
  },
  changePaymentButton: {
    id: 'store/details-page.action-bar.button.changePayment',
  },
})

class ActionBarContainer extends Component<Props> {
  private getSuggestedAction = () => {
    const { status, address, isSkipped, payment, onOpenModal } = this.props

    let action: SubscriptionAction | null = null
    let buttonVariation: 'primary' | 'secondary' = 'primary'
    let displayDanger = false

    if (status === 'PAUSED') {
      action = 'restore'
    } else if (!address) {
      action = 'changeAddress'
    } else if (!payment) {
      action = 'changePayment'
    } else if (isSkipped) {
      action = 'unskip'
      buttonVariation = 'secondary'
    }

    if (action === 'changeAddress' || action === 'changePayment') {
      displayDanger = true
    }

    let onClick
    if (
      action &&
      ['restore', 'unskip', 'changeAddress', 'changePayment'].includes(action)
    ) {
      onClick = () => onOpenModal(action as SubscriptionAction)
    }

    return { action, buttonVariation, displayDanger, onClick }
  }

  public render = () => {
    const {
      buttonVariation,
      displayDanger,
      onClick,
      action,
    } = this.getSuggestedAction()

    if (action === null) return null

    return (
      <div className="pb6">
        <Box>
          <div
            className={`mb2 t-body ${
              displayDanger ? 'c-danger fw5' : 'c-muted-1'
            }`}
          >
            <FormattedMessage
              id={`store/details-page.action-bar.label.${action}`}
            />
          </div>
          <div className="flex items-center flex-wrap justify-between">
            <div className="t-heading-4 w-100 w-60-l">
              <FormattedMessage
                id={`store/details-page.action-bar.text.${action}`}
                values={{
                  day: (
                    <FormattedDate
                      value={this.props.nextPurchaseDate}
                      month="long"
                      day="2-digit"
                    />
                  ),
                }}
              />
            </div>
            <div className="mw5-l w-100 mt4 w-40-l mt0-l pl0 pl6-l">
              <Button variation={buttonVariation} onClick={onClick} block>
                <FormattedMessage
                  id={`store/details-page.action-bar.button.${action}`}
                />
              </Button>
            </div>
          </div>
        </Box>
      </div>
    )
  }
}

type Props = {
  status: SubscriptionStatus
  isSkipped: boolean
  nextPurchaseDate: string
  address: Subscription['shippingAddress']
  payment: Subscription['purchaseSettings']['paymentMethod']
  onOpenModal: (action: SubscriptionAction) => void
}

export default ActionBarContainer
