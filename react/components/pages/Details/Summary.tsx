import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { TagTypeEnum, CSS, BASIC_CARD_WRAPPER } from '../../../constants'
import Alert from '../../commons/CustomAlert'
import Name from '../../commons/SubscriptionName'
import ItemsImage from '../../commons/ItemsImage'
import SubscriptionsStatus from '../../commons/SubscriptionStatus'
import SubscriptionTotals from './SubscriptionTotals'
import Menu from './Menu'
import { SubscriptionsGroup } from '.'

const SubscriptionSummary: FunctionComponent<Props> = ({ group }) => {
  const { subscriptions, isSkipped, status } = group

  const hasMultipleItems = subscriptions.length > 1

  return (
    <Fragment>
      <Alert
        visible={isSkipped}
        type={TagTypeEnum.Warning}
        contentId="subscription.skip.alert"
      />
      <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
        <div className="flex-ns items-center-s items-start-ns">
          <div className="flex flex-column">
            <span className="mb4 db b f4 tl c-on-base">
              <FormattedMessage id="subscription.summary" />
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
                subscriptionsGroupId={group.id}
                name={group.name}
                status={group.status}
                skus={group.subscriptions.map(
                  (subscription) => subscription.sku
                )}
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
                        <FormattedMessage id="subscription.summary.quantity" />
                      </div>
                      <div className="dib f6 fw4 c-muted-1 tr w-60">
                        {group.subscriptions[0].quantity}
                      </div>
                    </div>
                  )}
                  <SubscriptionTotals
                    totals={group.totals}
                    currencyCode={group.purchaseSettings.currencySymbol}
                  />
                </div>
              </div>
              <div className="w-50-ns w-100 flex justify-end-ns justify-center mt5">
                <div className="w-90-m w-100-s">
                  <Menu group={group} />
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
  group: SubscriptionsGroup
}

export default SubscriptionSummary
