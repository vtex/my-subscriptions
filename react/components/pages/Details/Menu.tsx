import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'
import { ActionMenu } from 'vtex.styleguide'

import { UpdateAction } from '../../../constants'

export function retrieveMenuOptions(
  isSkipped: boolean,
  status: SubscriptionStatus
) {
  return isSkipped
    ? [
        UpdateAction.OrderNow,
        UpdateAction.Unskip,
        UpdateAction.Pause,
        UpdateAction.Cancel,
      ]
    : status === SubscriptionStatus.Paused
    ? [UpdateAction.OrderNow, UpdateAction.Restore, UpdateAction.Cancel]
    : [
        UpdateAction.OrderNow,
        UpdateAction.Skip,
        UpdateAction.Pause,
        UpdateAction.Cancel,
      ]
}

const Menu: FunctionComponent<Props> = ({
  status,
  isSkipped,
  intl,
  onChangeUpdateAction,
}) => {
  const options = retrieveMenuOptions(isSkipped, status)
  const actionOptions = options.map(option => {
    return {
      label: intl.formatMessage({
        id: `subscription.manage.${option}`,
      }),
      onClick: () => onChangeUpdateAction(option),
    }
  })

  return (
    <ActionMenu
      label={intl.formatMessage({ id: 'subscription.manage' })}
      buttonProps={{ variation: 'secondary', block: true }}
      options={actionOptions}
    />
  )
}

type Props = {
  isSkipped: boolean
  status: SubscriptionStatus
  onChangeUpdateAction: (type: UpdateAction) => void
} & InjectedIntlProps

export default injectIntl(Menu)
