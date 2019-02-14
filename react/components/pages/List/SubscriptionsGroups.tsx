import React, { Fragment, FunctionComponent } from 'react'
import { compose } from 'recompose'

import { SubscriptionStatus } from '../../../enums'
import ITEMS from '../../../graphql/groupedSubscriptionsItems.gql'
import withQuery from '../../hocs/withQuery'
import EmptyState from './EmptyState'
import Item from './Item'
import Loading from './Loading'

const SubscriptionsGroups: FunctionComponent<InnerProps> = ({
  data: { items },
}) => {
  return (
    <Fragment>
      {items.map(item => (
        <Item item={item} />
      ))}
    </Fragment>
  )
}

const queryOptions = {
  options: (props: OuterProps) => ({
    variables: {
      status: props.filter,
    },
  }),
}

const enhance = compose<any, OuterProps>(
  withQuery({
    document: ITEMS,
    emptyState: EmptyState,
    errorCallback: e => console.error(e),
    errorState: () => <div>Error</div>,
    loadingState: Loading,
    operationOptions: queryOptions,
    validateEmpty,
  })
)

export default enhance(SubscriptionsGroups)

function validateEmpty(data: any) {
  if (
    data &&
    data.groupedSubscriptions &&
    data.groupedSubscriptions.length === 0
  ) {
    return true
  }

  return false
}

interface ItemsData {
  items: SubscriptionsGroupItemType[]
}

interface OuterProps {
  filter: SubscriptionStatus[]
}
interface InnerProps {
  data: ItemsData
}
