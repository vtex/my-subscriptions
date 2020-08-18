import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import memoize from 'memoize-one'
import { Box } from 'vtex.styleguide'

import {
  Subscription,
  SubscribableItem,
} from '../../graphql/queries/subscribePage.gql'
import { getName } from '../SubscriptionName'
import { displayFrequency } from '../Frequency/utils'
import Image from '../ProductImage'
import Button from '../SubscribeButton'

const messages = defineMessages({
  nextPurchase: {
    id: 'store/subscription.list.item.date.next.purchase',
    defaultMessage: '',
  },
  add: {
    id: 'store/subscribe.add-product',
    defaultMessage: 'Adicionar',
  },
})

const buildSkus = memoize((values: Subscription['items']) => {
  return values.map((item) => item.sku)
})

const buildSkuIds = memoize((values: Subscription['items']) => {
  return values.map((item) => item.sku.id)
})

const SubscriptionBox: FunctionComponent<Props> = ({
  subscription,
  intl,
  item,
  isLoading,
  onAdd,
}) => {
  const skus = buildSkus(subscription.items)
  const skuIds = buildSkuIds(subscription.items)

  return (
    <Box>
      <article className="flex flex-wrap items-center justify-between">
        <div className="w-70-l w-100 flex items-center">
          <Image
            imageUrl={subscription.items[0].sku.imageUrl}
            width={100}
            height={100}
            productName={subscription.items[0].sku.name}
          />
          <div className="pl4">
            <div className="t-heading-5 truncate">
              {getName(intl, subscription.name, skus)}
            </div>
            <p className="t-body mt6">
              {displayFrequency({
                interval: subscription.plan.frequency.interval,
                intl,
                periodicity: subscription.plan.frequency.periodicity,
                purchaseDay: subscription.plan.purchaseDay,
              })}
            </p>
            <p className="t-small c-muted-1 mb0">
              {intl.formatMessage(messages.nextPurchase, {
                date: intl.formatDate(subscription.nextPurchaseDate),
              })}
            </p>
          </div>
        </div>
        <div className="w-30-l w-100 flex justify-end-l justify-center mt0-l mt4">
          <Button
            subscribedSkus={skuIds}
            skuId={item.skuId}
            isLoading={isLoading}
            targetPlan={subscription.plan.id}
            availablePlans={item.plans}
            buttonType="secondary"
            onClick={() => onAdd(subscription.id)}
          >
            {intl.formatMessage(messages.add)}
          </Button>
        </div>
      </article>
    </Box>
  )
}

type Props = {
  isLoading: boolean
  subscription: Subscription
  item: SubscribableItem
  onAdd: (subscriptionId: string) => void
} & InjectedIntlProps

export default injectIntl(SubscriptionBox)
