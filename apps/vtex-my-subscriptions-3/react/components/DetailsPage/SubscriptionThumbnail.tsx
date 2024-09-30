import type { FunctionComponent } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl } from 'react-intl'
import type { Periodicity } from 'vtex.subscriptions-graphql'

import { getName } from '../SubscriptionName'
import { displayFrequency } from '../Frequency/utils'

const SubscriptionThumbnail: FunctionComponent<Props> = ({
  skus,
  intl,
  name,
  interval,
  periodicity,
  purchaseDay,
}) => {
  return (
    <article className="flex flex-wrap pv6 ph3" style={{ minWidth: '24rem' }}>
      <img className="w-20 mw3 pr3" src={skus[0].imageUrl} alt={skus[0].name} />
      <div className="w-80">
        <div className="t-heading-5 truncate">{getName(intl, name, skus)}</div>
        <p className="t-small c-muted-1">
          {displayFrequency({ interval, intl, periodicity, purchaseDay })}
        </p>
      </div>
    </article>
  )
}

type Props = {
  name?: string | null
  skus: Array<{ name: string; imageUrl: string; detailUrl: string }>
  interval: number
  purchaseDay: string | null
  periodicity: Periodicity
} & WrappedComponentProps

export default injectIntl(SubscriptionThumbnail)
