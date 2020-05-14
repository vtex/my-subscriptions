import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

const EditButton: FunctionComponent<Props> = ({
  subscriptionStatus,
  onEdit,
  testId,
}) => {
  if (subscriptionStatus === 'ACTIVE' || subscriptionStatus === 'PAUSED')
    return (
      <Button
        size="small"
        variation="tertiary"
        onClick={onEdit}
        testId={testId}
        disabled={subscriptionStatus === 'PAUSED'}
      >
        <FormattedMessage id="subscription.actions.edit" />
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
