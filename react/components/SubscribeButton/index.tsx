import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import { Button, ButtonPlain, Tooltip } from 'vtex.styleguide'

import { subscribable, subscribed } from './utils'

const messages = defineMessages({
  frequencyNotAvailable: {
    id: 'store/subscribe-button.frequency-not-available',
    defaultMessage: '',
  },
})

const SubscribeButton: FunctionComponent<Props> = ({
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
      {children}
    </TargetButton>
  )

  if (isSubscribable) {
    return FinalButton
  }

  return (
    <Tooltip label={intl.formatMessage(messages.frequencyNotAvailable)}>
      {FinalButton}
    </Tooltip>
  )
}

type Props = {
  skuId: string
  isLoading: boolean
  subscribedSkus: string[]
  targetPlan: string
  availablePlans: string[]
  onClick: () => void
  buttonType: 'plain' | 'secondary'
} & InjectedIntlProps

export default injectIntl(SubscribeButton)
