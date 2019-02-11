import React, { FunctionComponent } from 'react'
import { compose } from 'recompose'

import { SubscriptionStatus } from '../../../enums'
import GET_SUBSCRIPTIONS from '../../../graphql/getGroupedSubscriptions.gql'
import withQuery from '../../hocs/withQuery'
import EmptyState from './EmptyState'
import Loading from './Loading'

interface Props {
  filter: SubscriptionStatus[]
}

const SubscriptionsGroups: FunctionComponent<Props> = ()  => {
  return <span> hey </span>
}

const queryOptions = {
  options: (props: Props) => ({
    variables: {
      status: props.filter,
    },
  }),
}

const enhance = compose<any, Props>(
  withQuery({
    document: GET_SUBSCRIPTIONS, 
    emptyState: EmptyState,
    errorCallback: (e) => console.error(e), 
    errorState: () => <div>Error</div>,
    loadingState: Loading, 
    operationOptions: queryOptions,
    validateEmpty,
  })
)

export default enhance(SubscriptionsGroups)

function validateEmpty(data: any) {
  if (data && data.groupedSubscriptions && data.groupedSubscriptions.length === 0) {
    return false
  }

  return false
}