import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { PaymentSystemGroup } from 'vtex.subscriptions-graphql'

import FREQUENCY_QUERY, {
  Result,
} from '../../../graphql/queries/availablePaymentAddresses.gql'
import { queryWrapper } from '../../../tracking'
import { INSTANCE } from '..'
import Box from '../../CustomBox'
import Section from '../../CustomBox/Section'
import Skeleton from './Skeleton'
import Payment from '../../DisplayPayment'
import Address from '../../DisplayAddress'

class SummarySection extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let isEditingAddress = false
    if (props.addresses.length > 0) {
      const [address] = props.addresses
      props.onChangeAddress({
        addressId: address.id,
        addressType: address.addressType as string,
      })
    } else {
      isEditingAddress = true
    }

    let isEditingPayment = false
    if (props.payments.length > 0) {
      const payment = props.payments.find(
        (currentPayment) => currentPayment.paymentSystemGroup === 'creditCard'
      )

      if (payment?.paymentAccount) {
        props.onChangePaymentSystemGroup({
          group: payment?.paymentSystemGroup,
          paymentSystemId: payment?.paymentSystemId,
        })

        props.onChangePaymentAccount({
          paymentSystemId: payment.paymentSystemId,
          paymentAccountId: payment.paymentAccount?.id,
        })
      }
    } else {
      isEditingPayment = true
    }

    this.state = {
      isEditingAddress,
      isEditingPayment,
    }
  }

  private getSelectedPayment = () => {
    const {
      payments,
      selectedPaymentAccountId,
      selectedPaymentSystemGroup,
    } = this.props

    return payments.find((payment) => {
      if (payment.paymentSystemGroup === selectedPaymentSystemGroup) {
        if (
          payment.paymentSystemGroup === 'creditCard' &&
          payment.paymentAccount?.id !== selectedPaymentAccountId
        ) {
          return false
        }

        return true
      }
      return false
    })
  }

  private getSelectedAddress = () => {
    const { selectedAddressId, addresses } = this.props

    return addresses.find((address) => address.id === selectedAddressId)
  }

  public render() {
    const { isEditingAddress, isEditingPayment } = this.state

    const payment = this.getSelectedPayment()
    const address = this.getSelectedAddress()

    return (
      <Box>
        <Section borderBottom>
          {!isEditingPayment && payment && <Payment paymentMethod={payment} />}
        </Section>
        <Section borderBottom>
          {!isEditingAddress && address && <Address address={address} />}
        </Section>
      </Box>
    )
  }
}

type ChildProps = {
  loading: boolean
  addresses: Result['addresses']
  payments: Result['payments']
}

type OuterProps = {
  selectedPaymentSystemGroup: PaymentSystemGroup | null
  onChangePaymentSystemGroup: (args: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) => void
  selectedPaymentAccountId: string | null
  onChangePaymentAccount: (args: {
    paymentSystemId: string
    paymentAccountId: string
  }) => void
  selectedAddressId: string | null
  onChangeAddress: (args: { addressId: string; addressType: string }) => void
}

type InnerProps = ChildProps

type State = {
  isEditingAddress: boolean
  isEditingPayment: boolean
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  queryWrapper<OuterProps, Result, void, ChildProps>(
    `${INSTANCE}/FrequencySection`,
    FREQUENCY_QUERY,
    {
      options: {
        fetchPolicy: 'network-only',
      },
      props: ({ data }) => ({
        loading: data?.loading ?? false,
        addresses: data?.addresses ?? [],
        payments: data?.payments ?? [],
      }),
    }
  ),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)

export default enhance(SummarySection)