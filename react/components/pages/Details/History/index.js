import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-accessible-accordion'
import { intlShape, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { compose, branch, withProps, renderNothing } from 'recompose'

import OrderHistory from './OrderHistory'

const PAGE_SIZE = 3

class History extends Component {
  state = {
    visible: PAGE_SIZE,
  }

  handleViewMore = () => {
    this.setState(prevState => ({ visible: prevState.visible + PAGE_SIZE }))
  }

  render() {
    const { filteredInstances, intl } = this.props

    const showViewMore = this.state.visible < filteredInstances.length
    const visibleInstances = filteredInstances.slice(0, this.state.visible)

    return (
      <div className="myo-subscription__history pb3">
        {filteredInstances.length > 0 && (
          <div className="ba b--muted-5 bw1 pa5 b f4 tl c-on-base">
            {intl.formatMessage({
              id: 'subscription.order.history',
            })}
          </div>
        )}
        <Accordion>
          {visibleInstances.map(instance => {
            return (
              instance.orderInfo &&
              instance.orderInfo.orderId && (
                <OrderHistory
                  key={instance.workflowId}
                  orderId={instance.orderInfo.orderId}
                />
              )
            )
          })}
        </Accordion>
        {showViewMore && (
          <div className="pa3 bb br bl b--muted-5 flex justify-center">
            <Button
              size="small"
              variation="secondary"
              onClick={this.handleViewMore}
              default>
              <span>{intl.formatMessage({ id: 'subscription.seeMore' })}</span>
            </Button>
          </div>
        )}
      </div>
    )
  }
}

History.propTypes = {
  intl: intlShape.isRequired,
  instances: PropTypes.array.isRequired,
  filteredInstances: PropTypes.array.isRequired,
}

const enhance = compose(
  injectIntl,
  withProps(({ instances }) => ({
    filteredInstances: instances.filter(
      instance => instance.orderInfo && instance.orderInfo.orderId
    ),
  })),
  branch(
    ({ filteredInstances }) => filteredInstances.length === 0,
    renderNothing
  )
)

export default enhance(History)
