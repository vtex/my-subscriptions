import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert } from 'vtex.styleguide'

import { CSS, BASIC_CARD_WRAPPER } from '../../constants'
import Name from '../SubscriptionName'
import ItemsImage from './ItemsImage'
import SubscriptionsStatus from '../SubscriptionStatus'
import SubscriptionTotals from './SubscriptionTotals'
import Menu from './Menu'
import { Subscription } from '.'

const SubscriptionSummary: FunctionComponent<Props> = ({ subscription }) => {
  const { subscriptions, isSkipped, status } = subscription

  const hasMultipleItems = subscriptions.length > 1

  return (
    <Fragment>
      {isSkipped && (
        <Alert type="warning">
          <FormattedMessage id="store/subscription.skip.alert" />
        </Alert>
      )}
      <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
        <div className="flex-ns items-center-s items-start-ns">
          <div className="flex flex-column">
            <span className="mb4 db b f4 tl c-on-base">
              <FormattedMessage id="store/subscription.summary" />
            </span>
            <div className="pt5">
              <div className="myo-subscription__image-size relative items-center ba-ns bw1-ns b--muted-5">
                <ItemsImage items={subscriptions} />
              </div>
            </div>
          </div>
          <div className="pt9-l pt9-m pt4-s ph6-ns flex-grow-1">
            <div className="flex">
              <Name
                subscriptionId={subscription.id}
                name={subscription.name}
                status={subscription.status}
                skus={subscription.subscriptions.map((subs) => subs.sku)}
              />
              <div className="pl5-ns pl0-s pt0-ns pt5-s">
                <SubscriptionsStatus status={status} />
              </div>
            </div>
            <div className="flex flex-row-ns flex-column-s flex-wrap pt6">
              <div className="w-50-ns w-100 mt5">
                <div className="w-90-m w-100-s">
                  {!hasMultipleItems && (
                    <div className="pt2">
                      <div className="dib f6 fw4 c-muted-1 w-40">
                        <FormattedMessage id="store/subscription.summary.quantity" />
                      </div>
                      <div className="dib f6 fw4 c-muted-1 tr w-60">
                        {subscription.subscriptions[0].quantity}
                      </div>
                    </div>
                  )}
                  <SubscriptionTotals
                    totals={subscription.totals}
                    currencyCode={subscription.purchaseSettings.currencyCode}
                  />
                </div>
              </div>
              <div className="w-50-ns w-100 flex justify-end-ns justify-center mt5">
                <div className="w-90-m w-100-s">
                  <Menu subscription={subscription} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

interface Props {
  subscription: Subscription
}

export default SubscriptionSummary
