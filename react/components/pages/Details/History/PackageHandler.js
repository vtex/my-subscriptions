import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import FormattedDate from '../../../components/commons/FormattedDate'
import estimateShipping from '../../../utils/estimateShipping'
import OrderItems from './OrderItems'
import PackageProgressBar from '../../ProgressBar/PackageProgressBar/PackageProgressBar'
import PackageStatus from '../../ProgressBar/PackageProgressBar/PackageStatus'
import { packageProgressBarStates } from '../../../constants/index'
import { generatePackageProgressBarStates } from '../../../utils/progressBarUtils'

class PackageHandler extends Component {
  render() {
    const { packages, order } = this.props
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
                        { index: index + 1, total: packages.length },
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
                            pack.package,
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
  order: PropTypes.object,
}

export default injectIntl(PackageHandler)
