import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'recompose'
import { PageHeader as Header } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { PaymentSystemGroup } from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import Products from './Products'
import { OnAddItemArgs } from '../AddItemModal'
import Box from '../CustomBox'
import Section from '../CustomBox/Section'
import NameSection from './NameSection'
import FrequencySection from './FrequencySection'
import SummarySection from './SummarySection'

export const INSTANCE = 'NewSubscription'

class SubscriptionCreationContainer extends Component<Props, State> {
  public state: State = {
    products: [],
    currentPlan: null,
    name: null,
    selectedFrequency: '',
    selectedPurchaseDay: '',
    selectedAddress: null,
    selectedPaymentSystemGroup: null,
    selectedPaymentSystemId: null,
    selectedPaymentAccountId: null,
  }

  private handleRemoveItem = (skuId: string) =>
    this.setState(({ products, currentPlan }) => {
      const index = products.findIndex((product) => product.skuId === skuId)

      if (index >= 0) products.splice(index, 1)

      return {
        products,
        currentPlan: products.length === 0 ? null : currentPlan,
      }
    })

  private handleUpdateQuantity = ({
    skuId,
    quantity,
  }: {
    skuId: string
    quantity: number
  }) =>
    this.setState(({ products }) => {
      const index = products.findIndex((product) => product.skuId === skuId)

      if (index >= 0) {
        products[index].quantity = quantity
      }

      return {
        products,
      }
    })

  private handleAddItem = ({
    onError,
    onFinish,
    plans,
    ...productArgs
  }: OnAddItemArgs) =>
    this.setState(({ products, currentPlan }) => {
      products.push({
        ...productArgs,
      })

      onFinish()

      return currentPlan
        ? {
            products,
            currentPlan,
          }
        : {
            products,
            currentPlan: plans[0],
          }
    })

  private handleChangeName = (name: string) =>
    this.setState({ name: name === '' ? null : name })

  private handleChangeFrequency = (selectedFrequency: string) =>
    this.setState({ selectedFrequency })

  private handleChangePurchaseDay = (selectedPurchaseDay: string) =>
    this.setState({ selectedPurchaseDay })

  private handleChangeAddress = ({
    addressId,
    addressType,
  }: {
    addressId: string
    addressType: string
  }) =>
    this.setState({
      selectedAddress: { id: addressId, type: addressType },
    })

  private handleChangePaymentSystemGroup = ({
    group,
    paymentSystemId,
  }: {
    group: PaymentSystemGroup
    paymentSystemId?: string
  }) =>
    this.setState({
      selectedPaymentSystemGroup: group,
      selectedPaymentSystemId: paymentSystemId ?? null,
    })

  private handleChangePaymentAccount = ({
    paymentAccountId,
    paymentSystemId,
  }: {
    paymentAccountId: string
    paymentSystemId: string
  }) =>
    this.setState({
      selectedPaymentSystemId: paymentSystemId,
      selectedPaymentAccountId: paymentAccountId,
    })

  public render() {
    const { history, runtime } = this.props
    const {
      products,
      currentPlan,
      name,
      selectedFrequency,
      selectedPurchaseDay,
      selectedAddress,
      selectedPaymentAccountId,
      selectedPaymentSystemGroup,
    } = this.state

    return (
      <>
        <Header
          title={
            <span className="normal">
              <FormattedMessage
                id="store/creation-page.title"
                defaultMessage="New subscription"
              />
            </span>
          }
          linkLabel={
            <FormattedMessage
              id="store/creation-page.back-button"
              defaultMessage="All subscriptions"
            />
          }
          onLinkClick={() => history.push('/subscriptions')}
        />
        <div className="pa5 pa7-l flex flex-wrap">
          <div className="w-100 w-60-l">
            {currentPlan && (
              <div className="mb6">
                <Box>
                  <Section borderBottom>
                    <NameSection
                      products={products}
                      name={name}
                      onChangeName={this.handleChangeName}
                    />
                  </Section>
                  <Section>
                    <FrequencySection
                      planId={(currentPlan as unknown) as string}
                      selectedFrequency={selectedFrequency}
                      selectedPurchaseDay={selectedPurchaseDay}
                      onChangeFrequency={this.handleChangeFrequency}
                      onChangePurchaseDay={this.handleChangePurchaseDay}
                    />
                  </Section>
                </Box>
              </div>
            )}
            <Products
              products={products}
              onAddItem={this.handleAddItem}
              onRemoveItem={this.handleRemoveItem}
              onUpdateQuantity={this.handleUpdateQuantity}
              currentPlan={currentPlan}
              currencyCode={runtime.culture.currency}
            />
          </div>
          <div className="w-100 w-40-l pt6 pt0-l pl0 pl6-l">
            <SummarySection
              selectedAddressId={selectedAddress?.id ?? null}
              onChangeAddress={this.handleChangeAddress}
              selectedPaymentAccountId={selectedPaymentAccountId}
              selectedPaymentSystemGroup={selectedPaymentSystemGroup}
              onChangePaymentAccount={this.handleChangePaymentAccount}
              onChangePaymentSystemGroup={this.handleChangePaymentSystemGroup}
              totals={[]}
              currencyCode={runtime.culture.currency}
            />
          </div>
        </div>
      </>
    )
  }
}

export type Product = {
  skuId: string
  name: string
  price: number
  unitMultiplier: number
  measurementUnit: string
  brand: string
  imageUrl: string
  quantity: number
}

type State = {
  products: Product[]
  currentPlan: string | null
  name: string | null
  selectedPurchaseDay: string
  selectedFrequency: string
  selectedPaymentSystemGroup: PaymentSystemGroup | null
  selectedPaymentSystemId: string | null
  selectedPaymentAccountId: string | null
  selectedAddress: { id: string; type: string } | null
}

type Props = RouteComponentProps & InjectedRuntimeContext

const enhance = compose<Props, {}>(withRouter, withRuntimeContext)

export default enhance(SubscriptionCreationContainer)
