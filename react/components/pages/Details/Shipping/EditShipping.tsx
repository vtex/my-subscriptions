import { FetchPolicy } from 'apollo-client'
import React, { FunctionComponent } from 'react'
import { graphql } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { branch, compose, renderComponent, withProps } from 'recompose'
import { Button, Dropdown } from 'vtex.styleguide'

import Alert from '../../../commons/CustomAlert'
import { TagTypeEnum, CSS, BASIC_CARD_WRAPPER } from '../../../../constants'
import GET_ADDRESSES from '../../../../graphql/getAddresses.gql'
import EditionButtons from '../EditionButtons'
import ShippingSkeleton from './ShippingSkeleton'

function transformAddresses(addresses: Address[]) {
  return addresses.map(address => {
    return {
      label: `${address.street}, ${address.number}`,
      value: address.addressId,
    }
  })
}

const EditShipping: FunctionComponent<
  InnerProps & OuterProps & InjectedIntlProps
> = ({
  addresses,
  selectedAddressId,
  onCloseErrorAlert,
  onChangeAddress,
  onGoToCreateAddress,
  onCancel,
  onSave,
  showErrorAlert,
  errorMessage,
  isLoading,
  intl,
}) => {
  return (
    <div className={`${BASIC_CARD_WRAPPER} ${CSS.cardHorizontalPadding}`}>
      <div className="flex flex-row">
        <div className="db-s di-ns b f4 tl c-on-base">
          {intl.formatMessage({
            id: 'subscription.shipping',
          })}
        </div>
      </div>
      <div className="flex pt5 w-100-s mr-auto flex-column">
        <Alert
          visible={showErrorAlert}
          type={TagTypeEnum.Error}
          onClose={onCloseErrorAlert}
          contentId={errorMessage}
        />
        <div className="w-100">
          <Dropdown
            label={intl.formatMessage({
              id: 'subscription.shipping.address',
            })}
            options={transformAddresses(addresses)}
            value={selectedAddressId}
            onChange={onChangeAddress}
          />
        </div>
        <div className="pt3 pb4 nl5">
          <Button
            size="small"
            variation="tertiary"
            onClick={onGoToCreateAddress}
          >
            {intl.formatMessage({
              id: 'subscription.shipping.newAddress',
            })}
          </Button>
        </div>
        <EditionButtons
          isLoading={isLoading}
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

const addressesQuery = {
  name: 'addressesData',
  options({ subscriptionsGroup }: OuterProps) {
    return {
      fetchPolicy: 'network-only' as FetchPolicy,
      variables: {
        orderGroup: subscriptionsGroup.orderGroup,
      },
    }
  },
}

interface QueryResults {
  loading: boolean
  addresses: Address[]
}

interface InnerProps {
  addressesData: QueryResults
  addresses: Address[]
}

interface OuterProps {
  onSave: () => void
  onCancel: () => void
  onChangeAddress: (e: any) => void
  onCloseErrorAlert: () => void
  onGoToCreateAddress: () => void
  subscriptionsGroup: SubscriptionsGroupItemType
  selectedAddressId: string
  showErrorAlert: boolean
  errorMessage: string
  isLoading: boolean
}

export default compose<any, OuterProps>(
  injectIntl,
  graphql(GET_ADDRESSES, addressesQuery),
  branch(
    ({ addressesData }: InnerProps) =>
      addressesData.loading ||
      !addressesData.addresses ||
      addressesData.addresses.length === 0,
    renderComponent(ShippingSkeleton)
  ),
  withProps(({ addressesData }: InnerProps) => ({
    addresses: addressesData.addresses,
  }))
)(EditShipping)
