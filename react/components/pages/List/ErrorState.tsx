import React, { FunctionComponent } from 'react'

import Alert from '../../commons/CustomAlert'
import { TagTypeEnum } from '../../../constants'

const ErrorStateSubscriptionsGroupList: FunctionComponent<Props> = ({
  data,
}) => {
  return (
    <div className="mw7 center">
      <Alert
        visible={true}
        type={TagTypeEnum.Error}
        action={{
          labelId: 'subscription.fallback.error.refresh.message',
          onClick: () => data && data.refetch(),
        }}
        contentId="subscription.fallback.error.message"
      />
    </div>
  )
}

export default ErrorStateSubscriptionsGroupList

interface Props {
  data?: GraphqlDataProp
}

interface GraphqlDataProp {
  refetch: () => void
}
