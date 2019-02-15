import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Dropdown } from 'vtex.styleguide'

import { SubscriptionDisplayFilterEnum } from '../../../enums'
import { convertFilter } from '../../../utils'
import SubscriptionsGroups from './SubscriptionsGroups'

class SubscriptionsGroupListContainer extends Component<InjectedIntlProps> {
  public state = {
    filter: SubscriptionDisplayFilterEnum.Active,
  }

  public render() {
    const { intl } = this.props
    const { filter } = this.state

    const filterLabel = intl.formatMessage({ id: 'subscription.list.display' })
    const filterOptions = [
      {
        label: intl.formatMessage({
          id: `subscription.list.display.${SubscriptionDisplayFilterEnum.Active.toLowerCase()}`,
        }),
        value: SubscriptionDisplayFilterEnum.Active,
      },
      {
        label: intl.formatMessage({
          id: `subscription.list.display.${SubscriptionDisplayFilterEnum.Canceled.toLowerCase()}`,
        }),
        value: SubscriptionDisplayFilterEnum.Canceled,
      },
    ]

    const headerContent = (
      <div className="w5">
        <Dropdown
          label={filterLabel}
          size="large"
          options={filterOptions}
          value={filter}
          onChange={this.handleChangeFilter}
        />
      </div>
    )

    const headerConfig = {
      headerContent,
      namespace: 'vtex-account__subscriptions-list',
      titleId: 'subscription.title.list',
    }

    const resultFilter = convertFilter(filter)

    return (
      <ContentWrapper {...headerConfig}>
        {() => <SubscriptionsGroups filter={resultFilter} />}
      </ContentWrapper>
    )
  }

  private handleChangeFilter = (
    _: any,
    filter: SubscriptionDisplayFilterEnum
  ) => {
    this.setState({ filter })
  }
}

export default injectIntl(SubscriptionsGroupListContainer)
