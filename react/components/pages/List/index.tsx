import React, { Component } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { ContentWrapper } from 'vtex.my-account-commons'
import { Dropdown } from 'vtex.styleguide'

import { SubscriptionDisplayFilter } from '../../../enums'
import { convertFilter } from '../../../utils'
import SubscriptionsGroups from './SubscriptionsGroups'

class SubscriptionsGroupListContainer extends Component<InjectedIntlProps> {
  public state = {
    filter: SubscriptionDisplayFilter.Active,
  }

  public render () {
    const { intl } = this.props
    const { filter } = this.state
    
    const filterLabel = intl.formatMessage({ id: 'subscription.list.display' })
    const filterOptions = [
      {
        label: intl.formatMessage({ id: `subscription.list.display.${SubscriptionDisplayFilter.Active.toLowerCase()}` }),
        value: SubscriptionDisplayFilter.Active,
      },
      {
        label: intl.formatMessage({ id: `subscription.list.display.${SubscriptionDisplayFilter.Canceled.toLowerCase()}` }),
        value: SubscriptionDisplayFilter.Canceled,
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
        {() => <SubscriptionsGroups filter={resultFilter} /> } 
      </ContentWrapper>
    )
  }

  private handleChangeFilter = (_: any, filter: SubscriptionDisplayFilter) => {
    this.setState({ filter })
  }
}

export default injectIntl(SubscriptionsGroupListContainer)