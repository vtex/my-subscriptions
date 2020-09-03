import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { PageHeader as Header } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { SkeletonPiece } from 'vtex.my-account-commons'

const HeaderSkeleton: FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  return (
    <Header
      title={<SkeletonPiece width="50" size="4" />}
      linkLabel={
        <FormattedMessage id="store/details-page.page-header.back-button" />
      }
      onLinkClick={() => history.push('/subscriptions')}
    />
  )
}

export default withRouter(HeaderSkeleton)
