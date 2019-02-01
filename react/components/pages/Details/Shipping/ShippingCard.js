import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import {
  AddressSummary,
  addValidation,
  removeValidation,
} from '@vtex/address-form'
import { Button } from 'vtex.styleguide'

import LabeledInfo from '../../../LabeledInfo'
import DataSkeleton from '../DataCard/DataSkeleton'
import { getGUID } from '../../../../utils'
import { subscriptionsGroupShape } from '../../../../proptypes'
import { CANCELED_STATUS } from '../../../../constants'

class ShippingCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shipsTo: [],

      address: addValidation({
        addressId: getGUID(),
        addressType: 'residential',
        city: props.subscriptionsGroup.shippingAddress.city,
        complement: null,
        country: { value: 'BRA', label: 'Brazil' },
        geoCoordinates: [],
        neighborhood: props.subscriptionsGroup.shippingAddress.neighborhood,
        number: props.subscriptionsGroup.shippingAddress.number,
        postalCode: props.subscriptionsGroup.shippingAddress.postalCode,
        receiverName: null,
        reference: null,
        state: props.subscriptionsGroup.shippingAddress.state,
        street: props.subscriptionsGroup.shippingAddress.street,
        addressQuery: null,
      }),
      rules: {},
      loading: false,
    }
  }

  componentDidMount() {
    this.loadCurrentCountryRules()
  }

  componentDidUpdate(_, prevState) {
    const countryChanged =
      this.props.subscriptionsGroup.shippingAddress.country !==
      prevState.address.country.value

    if (countryChanged) {
      this.loadCurrentCountryRules()
    }
  }

  getCurrentRules() {
    const country = this.props.subscriptionsGroup.shippingAddress.country
    const selectedRules = this.state.rules[country]
    return selectedRules
  }

  loadCurrentCountryRules = () => {
    const country = this.props.subscriptionsGroup.shippingAddress.country
    const hasRulesLoaded = this.state.rules[country]
    if (hasRulesLoaded) {
      return
    }

    import(`@vtex/address-form/lib/country/${country}`)
      .then(rules => {
        this.setState(prevState => ({
          rules: { ...prevState.rules, [country]: rules },
        }))
      })
      .catch(() => {
        return import('@vtex/address-form/lib/country/default').then(rules => {
          this.setState(prevState => ({
            rules: { ...prevState.rules, [country]: rules },
          }))
        })
      })
  }

  render() {
    const { onEdit, intl, subscriptionsGroup } = this.props
    const selectedRules = this.getCurrentRules(this.state)

    if (!selectedRules) {
      return <DataSkeleton />
    }

    const displayEdit = subscriptionsGroup.status !== CANCELED_STATUS

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
              <AddressSummary
                address={removeValidation(this.state.address)}
                rules={selectedRules}
              />
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
}

ShippingCard.propTypes = {
  subscriptionsGroup: subscriptionsGroupShape.isRequired,
  onEdit: PropTypes.func,
  shippingAddress: PropTypes.object,
  intl: intlShape.isRequired,
}

export default injectIntl(ShippingCard)
