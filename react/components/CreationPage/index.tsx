import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'recompose'
import { Form, Formik } from 'formik'
import { PageHeader as Header, Button } from 'vtex.styleguide'
import { withRouter, RouteComponentProps } from 'vtex.my-account-commons/Router'
import { PaymentSystemGroup } from 'vtex.subscriptions-graphql'
import { withRuntimeContext, InjectedRuntimeContext } from 'vtex.render-runtime'

import Products from './Products'
import Box from '../CustomBox'
import Section from '../CustomBox/Section'
import NameSection from './NameSection'
import FrequencySection from './FrequencySection'
import SummarySection from './SummarySection'

export const INSTANCE = 'NewSubscription'

const INITIAL_STATE: SubscriptionForm = {
  name: null,
  planId: null,
  frequency: null,
  purchaseDay: null,
  address: null,
  paymentSystem: null,
  products: [],
}

class SubscriptionCreationContainer extends Component<Props, State> {
  public state: State = {
    isLoading: false,
  }

  private handleSave = () => {}

  public render() {
    const { history, runtime } = this.props
    const { isLoading } = this.state

    return (
      <>
        <Header
          title={
            <span className="normal">
              <FormattedMessage id="store/creation-page.title" />
            </span>
          }
          linkLabel={<FormattedMessage id="store/creation-page.back-button" />}
          onLinkClick={() => history.push('/subscriptions')}
        />
        <Formik<SubscriptionForm>
          initialValues={INITIAL_STATE}
          onSubmit={this.handleSave}
        >
          {(formik) => (
            <Form>
              <div className="pa5 pa7-l flex flex-wrap">
                <div className="w-100 w-60-l">
                  {formik.values.planId && (
                    <div className="mb6">
                      <Box>
                        <Section borderBottom>
                          <NameSection />
                        </Section>
                        <Section>
                          <FrequencySection planId={formik.values.planId} />
                        </Section>
                      </Box>
                    </div>
                  )}
                  <Products currencyCode={runtime.culture.currency} />
                </div>
                <div className="w-100 w-40-l pt6 pt0-l pl0 pl6-l">
                  <SummarySection currencyCode={runtime.culture.currency} />
                  <div className="mt7">
                    <Button
                      type="submit"
                      onClick={this.handleSave}
                      isLoading={isLoading}
                      disabled={!formik.isValid}
                      block
                    >
                      <FormattedMessage id="store/creation-page.create-subscription-button" />
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </>
    )
  }
}

export type SubscriptionForm = {
  name: string | null
  planId: string | null
  frequency: string | null
  purchaseDay: string | null
  paymentSystem: {
    id: string
    group: PaymentSystemGroup
    paymentAccountId: string | null
  } | null
  address: {
    id: string
    type: string
  } | null
  products: Product[]
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
  isLoading: boolean
}

type Props = RouteComponentProps & InjectedRuntimeContext

const enhance = compose<Props, {}>(withRouter, withRuntimeContext)

export default enhance(SubscriptionCreationContainer)
