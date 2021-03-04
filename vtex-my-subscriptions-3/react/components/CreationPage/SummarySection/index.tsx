import React, { Component } from 'react'
import { compose, branch, renderComponent } from 'recompose'
import { FormattedMessage } from 'react-intl'
import { connect, FormikContextType } from 'formik'
import { Total } from 'vtex.subscriptions-graphql'

import FREQUENCY_QUERY, {
  Result,
} from '../../../graphql/queries/availablePaymentAddresses.gql'
import { queryWrapper } from '../../../tracking'
import { SubscriptionForm } from '..'
import Box from '../../CustomBox'
import Title from '../../CustomBox/Title'
import Section from '../../CustomBox/Section'
import Skeleton from './Skeleton'
import Payment from '../../DisplayPayment'
import Address from '../../DisplayAddress'
import AddressSelector from '../../Selector/Address'
import PaymentSelector from '../../Selector/Payment'
import EditButton from '../../EditButton'
import Content from '../../Summary/Content'
import Footer from '../../Summary/Footer'
import { SimulationConsumer } from '../../SimulationContext'
import { INSTANCE } from '../constants'

class SummarySection extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let isEditingAddress = false
    if (props.addresses.length > 0) {
      const [address] = props.addresses
      props.formik.setFieldValue('address', {
        id: address.id,
        type: address.addressType,
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
        props.formik.setFieldValue('paymentSystem', {
          id: payment?.paymentSystemId,
          group: payment?.paymentSystemGroup,
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
      formik: { values },
    } = this.props

    return payments.find((payment) => {
      if (payment.paymentSystemGroup === values.paymentSystem?.group) {
        if (
          payment.paymentSystemGroup === 'creditCard' &&
          payment.paymentAccount?.id !== values.paymentSystem.paymentAccountId
        ) {
          return false
        }

        return true
      }
      return false
    })
  }

  private getSelectedAddress = () => {
    const { formik, addresses } = this.props

    return addresses.find((address) => address.id === formik.values.address?.id)
  }

  private handleEditAddress = () => this.setState({ isEditingAddress: true })

  private handleEditPayment = () => this.setState({ isEditingPayment: true })

  public render() {
    const { addresses, payments, currencyCode, formik } = this.props
    const { isEditingAddress, isEditingPayment } = this.state

    const payment = this.getSelectedPayment()
    const address = this.getSelectedAddress()

    return (
      <SimulationConsumer>
        {({ getTotals }) => {
          const totals: Total[] = getTotals() ?? []
          const displaySummary = totals.length > 0

          return (
            <Box footer={displaySummary && <Footer />}>
              <Section borderBottom>
                {!isEditingPayment && payment ? (
                  <div className="flex justify-between">
                    <Payment paymentMethod={payment} />
                    <EditButton
                      onClick={this.handleEditPayment}
                      withBackground
                    />
                  </div>
                ) : (
                  <PaymentSelector
                    payments={payments}
                    onChangePaymentAccount={(args) =>
                      formik.setFieldValue('paymentSystem', {
                        id: args.paymentSystemId,
                        paymentAccountId: args.paymentAccountId,
                        group: 'creditCard',
                      } as SubscriptionForm['paymentSystem'])
                    }
                    onChangePaymentSystemGroup={(args) =>
                      formik.setFieldValue('paymentSystem', {
                        id: args.paymentSystemId,
                        group: args.group,
                      })
                    }
                    selectedPaymentAccountId={
                      formik.values.paymentSystem?.paymentAccountId ?? null
                    }
                    selectedPaymentSystemGroup={
                      formik.values.paymentSystem?.group ?? null
                    }
                    errorMessagePaymentAccount={
                      formik.errors.paymentSystem &&
                      formik.touched.paymentSystem && (
                        <FormattedMessage id="required-field" />
                      )
                    }
                  />
                )}
              </Section>
              <Section borderBottom>
                {!isEditingAddress && address ? (
                  <div className="flex justify-between">
                    <Address address={address} />
                    <EditButton
                      onClick={this.handleEditAddress}
                      withBackground
                    />
                  </div>
                ) : (
                  <AddressSelector
                    addresses={addresses}
                    onChangeAddress={({ addressId, addressType }) =>
                      formik.setFieldValue('address', {
                        id: addressId,
                        type: addressType,
                      })
                    }
                    selectedAddressId={formik.values.address?.id ?? null}
                  />
                )}
              </Section>
              {displaySummary && (
                <>
                  <div className="pt7">
                    <Title>
                      <FormattedMessage id="summary.title" />
                    </Title>
                  </div>
                  <Section>
                    <Content totals={totals} currencyCode={currencyCode} />
                  </Section>
                </>
              )}
            </Box>
          )
        }}
      </SimulationConsumer>
    )
  }
}

type ChildProps = {
  loading: boolean
  addresses: Result['addresses']
  payments: Result['payments']
}

type OuterProps = {
  currencyCode: string
}

type InnerProps = ChildProps & { formik: FormikContextType<SubscriptionForm> }

type State = {
  isEditingAddress: boolean
  isEditingPayment: boolean
}

type Props = InnerProps & OuterProps

const enhance = compose<Props, OuterProps>(
  queryWrapper<OuterProps, Result, void, ChildProps>(
    `${INSTANCE}/SummarySection`,
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
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton)),
  connect
)

export default enhance(SummarySection)
