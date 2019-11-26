import React, { FunctionComponent } from 'react'

import Alert from '../../commons/CustomAlert'
import { TagTypeEnum } from '../../../constants'

const ErrorStateSubscriptionsGroupList: FunctionComponent<Props> = ({
  refetch,
}) => {
  return (
    <div className="mw7 center">
      <Alert
        visible
        type={TagTypeEnum.Error}
        action={{
          labelId: 'subscription.fallback.error.refresh.message',
          onClick: () => refetch(),
        }}
        contentId="subscription.fallback.error.message"
      />
    </div>
  )
}

export default ErrorStateSubscriptionsGroupList

interface Props {
  refetch: () => void
}
