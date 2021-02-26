import React, { Component } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { PickupPointsModal } from 'vtex.pickup-points-modal'
import { countries, helpers } from 'vtex.address-form'

import pickupMock from './pickup-options.json'
import itemsMock from './items.json'
import logisticsInfoMock from './logistics-info.json'
import pickupPointsMock from './pickup-points.json'
import { newAddress } from './utils'

const API_KEY = 'AIzaSyATLp76vkHxfMZqJF_sJbjQqZwvSIBhsTM'

// eslint-disable-next-line react/prefer-stateless-function
class PickupPointsModalContainer extends Component<Props> {
  public state = {
    isModalOpen: true,
    searchAddress: helpers.addValidation(
      newAddress({
        geoCoordinates: [-43.185971, -22.943419],
      })
    ),
  }

  private onCloseModal = () => null

  private onChangeActiveDetails = () => null

  private handleAddressChange = () => null

  public render = () => {
    const { isModalOpen, searchAddress } = this.state

    console.log('test', countries)

    return isModalOpen ? (
      <PickupPointsModal
        activePickupPoint={pickupMock.pickupOptions[0]}
        askForGeolocation={false}
        changeActivePickupDetails={this.onChangeActiveDetails}
        changeActiveSLAOption={() => {}}
        closePickupPointsModal={this.onCloseModal}
        googleMapsKey={API_KEY}
        intl={this.props.intl}
        isPickupDetailsActive
        items={itemsMock.items}
        logisticsInfo={logisticsInfoMock.logisticsInfo}
        onAddressChange={this.handleAddressChange}
        pickupOptions={pickupMock.pickupOptions}
        rules={countries.BRA}
        searchAddress={searchAddress}
        selectedPickupPoint={pickupMock.pickupOptions[0]}
        storePreferencesData={{
          countryCode: 'BRA',
          currencyCode: 'BRL',
          currencySymbol: 'R$',
          currencyFormatInfo: {
            currencyDecimalDigits: 2,
            currencyDecimalSeparator: ',',
            currencyGroupSeparator: '.',
            currencyGroupSize: 3,
            startsWithCurrencySymbol: true,
          },
        }}
        pickupPoints={pickupPointsMock.pickupPoints}
      />
    ) : null
  }
}

interface Props extends WrappedComponentProps {
  onSelectAddress?: () => void
}

export default injectIntl(PickupPointsModalContainer)
