import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../constants'

const EditButton: FunctionComponent<Props> = ({
  subscriptionStatus,
  onEdit,
  testId,
}) => {
  if (
    subscriptionStatus === SubscriptionStatusEnum.Active ||
    subscriptionStatus === SubscriptionStatusEnum.Paused
  )
    return (
      <Button
        size="small"
        variation="tertiary"
        onClick={onEdit}
        disabled={subscriptionStatus === SubscriptionStatusEnum.Paused}
        testId={testId}
      >
        <FormattedMessage id="subscription.actions.edit" />
      </Button>
    )

  return null
}

interface Props {
  subscriptionStatus: SubscriptionStatusEnum
  onEdit: () => void
  testId: string
}

export default EditButton
