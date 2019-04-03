import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { AddressRules, AddressSummary } from 'vtex.address-form'
import { Button } from 'vtex.styleguide'

import { SubscriptionStatusEnum } from '../../../../constants'
import LabeledInfo from '../../../commons/LabeledInfo'

const ShippingCard: FunctionComponent<InjectedIntlProps & Props> = ({
  onEdit,
  intl,
  subscriptionsGroup,
}) => {
  const displayEdit =
    subscriptionsGroup.status === SubscriptionStatusEnum.Active

  return (
    <div className="card-height bw1 bg-base pa6 ba b--muted-5">
      <div className="flex flex-row">
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({
            id: 'subscription.shipping',
          })}
        </div>
        <div className="ml-auto">
          {displayEdit && (
            <Button size="small" variation="tertiary" onClick={onEdit}>
              {intl.formatMessage({
                id: 'subscription.actions.edit',
              })}
            </Button>
          )}
        </div>
      </div>
      <div className="flex pt3-s pt5-ns w-100">
        <div className="w-100">
          <LabeledInfo labelId="subscription.shipping.address">
            <AddressRules
              country={subscriptionsGroup.shippingAddress.country}
              shouldUseIOFetching>
              <AddressSummary address={subscriptionsGroup.shippingAddress} />
            </AddressRules>
          </LabeledInfo>
          <div className="flex flex-row-s flex-column-ns">
            <div className="w-60-s w-100-ns pt6">
              <LabeledInfo labelId="subscription.shipping.sla">
                &nbsp;
              </LabeledInfo>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
  onEdit: () => void
}

export default injectIntl(ShippingCard)
