import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { ProgressBarBundle, utils } from 'vtex.my-account-commons'

const { estimateShipping } = utils

const {
  constants: { packageProgressBarStates },
  utils: { generatePackageProgressBarStates },
  PackageProgressBar,
  PackageStatus,
} = ProgressBarBundle

import FormattedDate from '../../../../components/commons/FormattedDate'
import OrderItems from './OrderItems'

class PackageHandler extends Component {
  render() {
    const { packages } = this.props
    return (
      <div>
        {packages.map((pack, index) => {
          const shippingEstimate = estimateShipping(pack)
          return (
            <div key={`${pack.selectedSla}_${index}`}>
              <div className="pt5 bt b--muted-5">
                <div className="flex flex-row-ns flex-column-s">
                  <div>
                    <span className="b db">
                      {this.props.intl.formatMessage(
                        { id: 'subscription.package.index' },
                        { index: index + 1, total: packages.length }
                      )}
                    </span>
                    <span className="db f5 fw3">
                      {(shippingEstimate && shippingEstimate.label) || (
                        <FormattedDate
                          date={shippingEstimate.date}
                          style="short"
                        />
                      )}
                    </span>
                  </div>
                  <div className="pt4 pl8-m pl9-xl history-package-progress">
                    <PackageStatus
                      status={status}
                      pack={pack.package || {}}
                      packages={packages}
                      render={index => (
                        <PackageProgressBar
                          states={generatePackageProgressBarStates(
                            packageProgressBarStates,
                            index,
                            pack.package
                          )}
                          currentState={index}
                        />
                      )}
                    />
                  </div>
                </div>
                <OrderItems items={pack.items} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

PackageHandler.propTypes = {
  intl: intlShape.isRequired,
  packages: PropTypes.array,
}

export default injectIntl(PackageHandler)
