import React, { FunctionComponent } from 'react'
import { WrappedComponentProps, injectIntl, defineMessages } from 'react-intl'
import { ActionMenu } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { SubscriptionAction } from '../utils'

defineMessages({
  skipOption: {
    id: 'store/subscription.manage.skip',
  },
  unskipOption: {
    id: 'store/subscription.manage.unskip',
  },
  cancelOption: {
    id: 'store/subscription.manage.cancel',
  },
  pauseOption: {
    id: 'store/subscription.manage.pause',
  },
  restoreOption: {
    id: 'store/subscription.manage.restore',
  },
  orderNowOption: {
    id: 'store/subscription.manage.orderNow',
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
      id: `store/subscription.manage.${option}`,
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
