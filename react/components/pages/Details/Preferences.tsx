import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box } from 'vtex.styleguide'

import { CSS } from '../../../constants'
import EditButton from '../../commons/EditButton'
import FrequencyInfo from '../../commons/FrequencyInfo'

import { SubscriptionsGroup } from '.'

const Preferences: FunctionComponent<Props> = ({ group }) => {
  return (
    <Box>
      <div className={`${CSS.cardTitle} flex justify-between`}>
        <FormattedMessage
          id="store/subscriptions.card.preferences.title"
          defaultMessage="Preferences"
        />
        <EditButton
          onEdit={() => null}
          subscriptionStatus={group.status}
          testId="edit-products-button"
        />
      </div>
      <div className="flex flex-wrap">
        <div className="w-50-ns w-100">
          <FrequencyInfo
            periodicity={group.plan.frequency.periodicity}
            purchaseDay={group.purchaseSettings.purchaseDay}
            interval={group.plan.frequency.interval}
          />
        </div>
        <div className="w-50-ns w-100">
          <FrequencyInfo
            periodicity={group.plan.frequency.periodicity}
            purchaseDay={group.purchaseSettings.purchaseDay}
            interval={group.plan.frequency.interval}
          />
        </div>
        <div className="w-50-ns w-100">
          <FrequencyInfo
            periodicity={group.plan.frequency.periodicity}
            purchaseDay={group.purchaseSettings.purchaseDay}
            interval={group.plan.frequency.interval}
          />
        </div>
        <div className="w-50-ns w-100">
          <FrequencyInfo
            periodicity={group.plan.frequency.periodicity}
            purchaseDay={group.purchaseSettings.purchaseDay}
            interval={group.plan.frequency.interval}
          />
        </div>
      </div>
    </Box>
  )
}

type Props = {
  group: SubscriptionsGroup
}

export default Preferences
