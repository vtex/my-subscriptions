import React, { FunctionComponent } from 'react'
import { compose } from 'recompose'

import { SubscriptionStatus } from '../../../enums'
import GET_SUBSCRIPTIONS from '../../../graphql/getGroupedSubscriptions.gql'
import withQuery from '../../hocs/withQuery'
import Loading from './Loading'

interface Props {
  filter: SubscriptionStatus[]
}

const SubscriptionsGroups: FunctionComponent<Props> = ({ filter })  => {
  console.log('filter', filter)
  return <Loading />
}

const enhance = compose<any, Props>(
  withQuery({ document: GET_SUBSCRIPTIONS, errorCallback: (e) => console.log(e), loadingState: Loading, errorState: () => <div>Error</div> })
)

export default enhance(SubscriptionsGroups)