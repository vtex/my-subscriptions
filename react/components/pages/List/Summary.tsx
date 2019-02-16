import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface Props {
  item: SubscriptionsGroupItemType
  onGoToDetails: (orderGroup: string) => void
}

const SubscriptionsGroupItemSummary: FunctionComponent<Props> = ({
  item,
  onGoToDetails,
}) => {
  return (
    <div className="w-100 flex pv6 ph3">
      <div className="w-50">bode</div>
      <div className="w-50 flex flex-row flex-wrap">
        <div className="w-100 mw5 self-center center">
          <Button
            variation="secondary"
            onClick={() => onGoToDetails(item.orderGroup)}
            block>
            <FormattedMessage id="subscription.list.button.seeDetails" />
          </Button>
          <div className="pt4">
            <Button variation="secondary" block>
              <FormattedMessage id="subscription.list.button.reactivate" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsGroupItemSummary
