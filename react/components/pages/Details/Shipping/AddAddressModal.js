import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import {
  AddressForm,
  AddressContainer,
  CountrySelector,
  PostalCodeGetter,
  AutoCompletedFields,
  addValidation,
  removeValidation,
} from '@vtex/address-form'
import { compose, graphql } from 'react-apollo'
import CustomInput from '@vtex/address-form/lib/CustomInput'
import { Button, Modal, Spinner, Alert } from 'vtex.styleguide'

import getGGUID from '../../../utils/index'
import AddNewAddress from '../../../graphql/AddNewAddress.gql'
import { COUNTRIES } from '../../../constants'

class EditAddressModal extends Component {
  state = {
    shipsTo: [],
    address: addValidation({
      addressId: getGGUID(),
      addressType: 'residential',
      city: null,
      complement: null,
      country: { value: 'BRA', label: 'Brazil' },
      geoCoordinates: [],
      neighborhood: null,
      number: null,
      postalCode: null,
      receiverName: null,
      reference: null,
      state: null,
      street: null,
      addressQuery: null,
    }),
    rules: {},
    isLoading: false,
  }

  componentDidMount() {
    this.loadCurrentCountryRules()
    const {
      culture: { locale },
    } = global.__RUNTIME__
    this.addCountryLabel(COUNTRIES, locale)
  }

  addCountryLabel(countries, locale) {
    return import(`i18n-country-code/locales/${locale.slice(0, 2)}.json`).then(
      translations => {
        this.setState({
          shipsTo: countries.map(countryCode => ({
            label: translations[countryCode],
            value: countryCode,
          })),
        })
      }
    )
  }

  componentDidUpdate(_, prevState) {
    const countryChanged =
      this.state.address.country.value !== prevState.address.country.value

    if (countryChanged) {
      this.loadCurrentCountryRules()
    }
  }

  loadCurrentCountryRules = () => {
    const country = this.state.address.country.value
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

  handleAddressChange = address => {
    this.setState(prevState => ({
      address: {
        ...prevState.address,
        ...address,
      },
    }))
  }

  handleSave = () => {
    this.setState({ isLoading: true }, () => {
      this.props
        .addAddress({
          variables: {
            address: removeValidation(this.state.address),
            subscriptionId: this.props.subscription.orderGroup,
          },
        })
        .then(() => {
          this.setState({ isLoading: false })
          this.props.addressesData
            .refetch({
              variables: { subscription: this.props.subscription },
            })
            .then(() => {
              this.props.onCloseSuccess()
            })
        })
        .catch(e => {
          this.props.onCloseError(e)
        })
    })
  }

  getCurrentRules(state) {
    const country = state.address.country.value
    const selectedRules = state.rules[country]
    return selectedRules
  }

  render() {
    const {
      isModalOpen,
      onClose,
      showErrorAlert,
      errorMessage,
      intl,
    } = this.props
    const { address, shipsTo, isLoading } = this.state
    const { account } = global.__RUNTIME__

    const selectedRules = this.getCurrentRules(this.state)

    if (!selectedRules) {
      return (
        <Modal centered isOpen={isModalOpen} onClose={onClose}>
          <Spinner />
        </Modal>
      )
    }

    return (
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <div className="pb4">
          <span className="tl b f4 c-on-base">
            {intl.formatMessage({
              id: 'subscription.shipping.newAddress',
            })}
          </span>
        </div>
        <div className="address-form myo-font">
          <AddressContainer
            accountName={account}
            address={this.state.address}
            rules={selectedRules}
            onChangeAddress={this.handleAddressChange}
            autoCompletePostalCode
          >
            {onChangeAddress => (
              <div>
                <CountrySelector
                  Input={CustomInput}
                  address={address}
                  shipsTo={shipsTo}
                  onChangeAddress={onChangeAddress}
                />

                <PostalCodeGetter
                  Input={CustomInput}
                  address={address}
                  rules={selectedRules}
                  onChangeAddress={onChangeAddress}
                />

                <AutoCompletedFields
                  address={address}
                  rules={selectedRules}
                  onChangeAddress={onChangeAddress}
                >
                  <a
                    className="c-link hover-c-link pointer pt3 link-edit"
                    id="force-shipping-fields"
                  >
                    {intl.formatMessage({
                      id: 'address-form.edit',
                    })}
                  </a>
                </AutoCompletedFields>
                <div className="pt2">
                  <AddressForm
                    Input={CustomInput}
                    address={this.state.address}
                    rules={selectedRules}
                    onChangeAddress={onChangeAddress}
                  />
                </div>
              </div>
            )}
          </AddressContainer>
          {showErrorAlert && (
            <div className="mt5 mb5">
              <Alert
                type="error"
                autoClose={3000}
                onClose={this.handleCloseErrorAlert}
              >
                {intl.formatMessage({
                  id: `${errorMessage}`,
                })}
              </Alert>
            </div>
          )}
          <div className="flex flex-row justify-end mt6">
            <span className="mr4">
              <Button size="small" variation="tertiary" onClick={onClose}>
                {intl.formatMessage({
                  id: 'commons.cancel',
                })}
              </Button>
            </span>
            <Button
              size="small"
              variation="primary"
              isLoading={isLoading}
              onClick={this.handleSave}
            >
              {intl.formatMessage({
                id: 'subscription.actions.save',
              })}
            </Button>
          </div>
        </div>
      </Modal>
    )
  }
}

const addAddressMutation = {
  name: 'addAddress',
  options({ subscriptionId, address }) {
    return {
      variables: {
        subscriptionId: subscriptionId,
        address: address,
      },
    }
  },
}

EditAddressModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  subscription: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  addAddress: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  onCloseSuccess: PropTypes.func.isRequired,
  onCloseError: PropTypes.func.isRequired,
  showErrorAlert: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  addressesData: PropTypes.object,
}

export default compose(graphql(AddNewAddress, addAddressMutation))(
  injectIntl(EditAddressModal)
)
