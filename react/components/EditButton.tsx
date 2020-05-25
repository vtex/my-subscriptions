import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatus } from '../../constants'

const EditButton: FunctionComponent<Props> = ({
  subscriptionStatus,
  onEdit,
  testId,
}) => {
  if (
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.Paused
  )
    return (
      <Button
        size="small"
        variation="tertiary"
        onClick={onEdit}
        disabled={subscriptionStatus === SubscriptionStatus.Paused}
        testId={testId}
      >
        <FormattedMessage id="store/subscription.actions.edit" />
      </Button>
    )

  return null
}

interface Props {
  subscriptionStatus: SubscriptionStatus
  onEdit: () => void
  testId: string
}

export default EditButton
