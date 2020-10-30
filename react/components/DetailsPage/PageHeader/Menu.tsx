import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { ActionMenu } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { SubscriptionAction } from '../utils'

defineMessages({
  skipOption: {
    id: 'subscription.manage.skip',
  },
  unskipOption: {
    id: 'subscription.manage.unskip',
  },
  cancelOption: {
    id: 'subscription.manage.cancel',
  },
  pauseOption: {
    id: 'subscription.manage.pause',
  },
  restoreOption: {
    id: 'subscription.manage.restore',
  },
  orderNowOption: {
    id: 'subscription.manage.orderNow',
  },
})

function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus,
  orderFormId: string | undefined
): SubscriptionAction[] {
  const options: SubscriptionAction[] = isSkipped
    ? ['unskip', 'pause', 'cancel']
    : status === 'PAUSED'
    ? ['restore', 'cancel']
    : ['skip', 'pause', 'cancel']

  if (orderFormId) {
    options.push('orderNow')
  }

  return options
}

const Menu: FunctionComponent<Props> = ({
  status,
  intl,
  orderFormId,
  isSkipped,
  onUpdateAction,
}) => {
  if (status === 'CANCELED') return null

  const options = retrieveMenuOptions(isSkipped, status, orderFormId)

  const actionOptions = options.map((option) => ({
    label: intl.formatMessage({
      id: `subscription.manage.${option}`,
    }),
    onClick: () => onUpdateAction(option),
  }))

  return (
    <ActionMenu
      buttonProps={{ variation: 'tertiary' }}
      options={actionOptions}
    />
  )
}

type Props = {
  status: SubscriptionStatus
  orderFormId?: string
  isSkipped: boolean
  onUpdateAction: (action: SubscriptionAction) => void
} & WrappedComponentProps

export default injectIntl(Menu)
