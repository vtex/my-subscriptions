import React, { FunctionComponent } from 'react'

interface Props {
  item: SubscriptionsGroupItemType
}

const SubscriptionsGroupItemSummary: FunctionComponent<Props> = ({ item }) => {
  console.log(item)
  return <div className="w-100 pa6">bode</div>
}

export default SubscriptionsGroupItemSummary
