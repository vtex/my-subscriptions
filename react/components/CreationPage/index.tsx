import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'

class SubscriptionCreationContainer extends Component<Props> {
  public state = {
    products: [],
  }

  public render() {
    const { history } = this.props

    return (
      <>
        <Header
          title={
            <span className="normal">
              <FormattedMessage
                id="store/creation-page.title"
                defaultMessage="New subscription"
              />
            </span>
          }
          linkLabel={
            <FormattedMessage
              id="store/creation-page.back-button"
              defaultMessage="All subscriptions"
            />
          }
          onLinkClick={() => history.push('/subscriptions')}
        />
      </>
    )
  }
}

type Props = RouteComponentProps

export default withRouter(SubscriptionCreationContainer)
