import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import {
  AddressSummary,
  addValidation,
  removeValidation,
} from '@vtex/address-form'
import { Button } from 'vtex.styleguide'

import DataSkeleton from '../DataCard/DataSkeleton'
import getGGUID from '../../../utils/index'

class ShippingCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shipsTo: [],

      address: addValidation({
        addressId: getGGUID(),
        addressType: 'residential',
        city: props.subscription.shippingAddress.city,
        complement: null,
        country: { value: 'BRA', label: 'Brazil' },
        geoCoordinates: [],
        neighborhood: props.subscription.shippingAddress.neighborhood,
        number: props.subscription.shippingAddress.number,
        postalCode: props.subscription.shippingAddress.postalCode,
        receiverName: null,
        reference: null,
        state: props.subscription.shippingAddress.state,
        street: props.subscription.shippingAddress.street,
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
      this.props.subscription.shippingAddress.country !==
      prevState.address.country.value

    if (countryChanged) {
      this.loadCurrentCountryRules()
    }
  }

  getCurrentRules() {
    const country = this.props.subscription.shippingAddress.country
    const selectedRules = this.state.rules[country]
    return selectedRules
  }

  loadCurrentCountryRules = () => {
    const country = this.props.subscription.shippingAddress.country
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
    const { onEdit, intl, sla } = this.props
    const selectedRules = this.getCurrentRules(this.state)

    if (!selectedRules) {
      return <DataSkeleton />
    }

    return (
      <div className="card-height bw1 bg-base pa6 ba b--muted-5">
        <div>
          <div className="flex flex-row">
            <div className="db-s di-ns b f4 tl c-on-base">
              {intl.formatMessage({
                id: 'subscription.shipping',
              })}
            </div>
            <div className="ml-auto">
              <Button size="small" variation="tertiary" onClick={onEdit}>
                <span>
                  {intl.formatMessage({
                    id: 'subscription.actions.edit',
                  })}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex pt3-s pt5-ns w-100">
            <div className="w-100 pt3">
              <span className="b db c-on-base">
                {intl.formatMessage({
                  id: 'subscription.shipping.address',
                })}
              </span>
              <span className="db fw3 f5-ns f6-s c-on-base">
                <AddressSummary
                  address={removeValidation(this.state.address)}
                  rules={selectedRules}
                />
              </span>
              <div className="flex flex-row-s flex-column-ns">
                <div className="w-60-s w-100-ns pt6">
                  <span className="b db c-on-base">
                    {intl.formatMessage({
                      id: 'subscription.shipping.sla',
                    })}
                  </span>
                  <span className="db fw3 f5-ns f6-s c-on-base">{sla}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ShippingCard.defaultProps = {
  sla: 'Mais rápida',
  tracking: '123456819293',
}

ShippingCard.propTypes = {
  subscription: PropTypes.object,
  onEdit: PropTypes.func,
  shippingAddress: PropTypes.object,
  sla: PropTypes.string,
  tracking: PropTypes.string,
  intl: intlShape.isRequired,
}

export default injectIntl(ShippingCard)
