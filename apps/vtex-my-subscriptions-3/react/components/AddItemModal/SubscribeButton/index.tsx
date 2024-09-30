import type { FunctionComponent } from 'react'
import React from 'react'
import type { WrappedComponentProps } from 'react-intl'
import { injectIntl, defineMessages } from 'react-intl'
import { Button, ButtonPlain } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { subscribable, subscribed } from './utils'

const CSS_HANDLES = ['productItemMessage']

const messages = defineMessages({
  frequencyNotAvailable: {
    id: 'subscribe-button.frequency-not-available',
  },
  added: {
    id: 'subscribe-button.added',
  },
})

const SubscribeButton: FunctionComponent<Props & WrappedComponentProps> = ({
  skuId,
  targetPlan,
  subscribedSkus,
  availablePlans,
  onClick,
  isLoading,
  intl,
  children,
  buttonType,
}) => {
  const isSubscribable = subscribable({ targetPlan, availablePlans })
  const isSubscribed = subscribed({ subscribedSkus, skuId })
  const handles = useCssHandles(CSS_HANDLES)

  const TargetButton = buttonType === 'plain' ? ButtonPlain : Button

  const FinalButton = (
    <TargetButton
      isLoading={isLoading}
      onClick={onClick}
      disabled={!isSubscribable || isSubscribed}
      variation={buttonType === 'secondary' ? buttonType : undefined}
    >
      {isSubscribed ? intl.formatMessage(messages.added) : children}
    </TargetButton>
  )

  if (isSubscribable) {
    return FinalButton
  }

  return (
    <span className={`${handles.productItemMessage} c-muted-1`}>
      {intl.formatMessage(messages.frequencyNotAvailable)}
    </span>
  )
}

type Props = {
  skuId: string
  isLoading: boolean
  subscribedSkus: string[]
  targetPlan: string | null
  availablePlans: string[]
  onClick: () => void
  buttonType: 'plain' | 'secondary'
}

export default injectIntl<'intl', Props & WrappedComponentProps>(
  SubscribeButton
)
