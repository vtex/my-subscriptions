import React, { FunctionComponent } from 'react'
import { injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'
import { Button, ButtonPlain } from 'vtex.styleguide'

import { subscribable, subscribed } from './utils'

const messages = defineMessages({
  frequencyNotAvailable: {
    id: 'store/subscribe-button.frequency-not-available',
    defaultMessage: '',
  },
  added: {
    id: 'store/subscribe-button.added',
    defaultMessage: '',
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
    <span className="c-muted-1">
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
