import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import type { MutationResult } from 'react-apollo'
import { graphql } from 'react-apollo'
import type { ApolloError } from 'apollo-client'
import { compose } from 'recompose'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { PageHeader as Header, Button } from 'vtex.styleguide'
import type { RouteComponentProps } from 'vtex.my-account-commons/Router'
import { withRouter } from 'vtex.my-account-commons/Router'
import type { PaymentSystemGroup } from 'vtex.subscriptions-graphql'
import type { InjectedRuntimeContext } from 'vtex.render-runtime'
import { withRuntimeContext } from 'vtex.render-runtime'

import type { Result as OrderFormResult } from '../../graphql/queries/orderForm.gql'
import ORDERFORM_QUERY from '../../graphql/queries/orderForm.gql'
import Products from './Products'
import Box from '../CustomBox'
import Section from '../CustomBox/Section'
import NameSection from './NameSection'
import FrequencySection from './FrequencySection'
import SummarySection from './SummarySection'
import type { SubscriptionForm as ValidForm } from '../SimulationContext'
import SimulationContext from '../SimulationContext'
import { extractFrequency } from '../Frequency/utils'
import type {
  Args as CreationArgs,
  Result as CreationResult,
} from '../../graphql/mutations/createSubscription.gql'
import CREATE_MUTATION from '../../graphql/mutations/createSubscription.gql'
import { logGraphQLError, getRuntimeInfo } from '../../tracking'
import { TOMORROW } from './constants'

const INITIAL_STATE: SubscriptionForm = {
  name: null,
  planId: null,
  frequency: null,
  purchaseDay: null,
  address: null,
  paymentSystem: null,
  products: [],
  nextPurchaseDate: TOMORROW,
  expirationDate: null,
}

const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().nullable().min(3).max(50),
  planId: Yup.string().required('requiredField'),
  frequency: Yup.string().required('requiredField'),
  purchaseDay: Yup.string().required('requiredField'),
  address: Yup.object().required('requiredField'),
  paymentSystem: Yup.object().required('requiredField'),
  products: Yup.array().min(1).required('requiredField'),
})

class SubscriptionCreationContainer extends Component<Props, State> {
  public state: State = {
    isLoading: false,
  }

  private assembleForm = (
    formikValues: SubscriptionForm,
    salesChannel?: string
  ): ValidForm | null => {
    if (
      !formikValues.address ||
      !formikValues.frequency ||
      !formikValues.purchaseDay ||
      !formikValues.planId ||
      !formikValues.paymentSystem?.id
    )
      return null

    const frequency = extractFrequency(formikValues.frequency)
    const assembledForm: ValidForm = {
      name: formikValues.name,
      nextPurchaseDate: formikValues.nextPurchaseDate.toISOString(),
      plan: {
        id: formikValues.planId,
        frequency,
        validity: {
          begin: new Date().toISOString(),
          end: formikValues.expirationDate?.toISOString(),
        },
        purchaseDay: formikValues.purchaseDay,
      },
      shippingAddress: {
        addressId: formikValues.address.id,
        addressType: formikValues.address.type,
      },
      items: formikValues.products.map(({ skuId, quantity }) => ({
        id: skuId,
        quantity,
      })),
      paymentMethod: {
        paymentSystemId: formikValues.paymentSystem.id,
        paymentAccountId:
          formikValues.paymentSystem.paymentAccountId ?? undefined,
      },
    }

    if (salesChannel) assembledForm.salesChannel = salesChannel

    return assembledForm
  }

  private handleSave = (formikValues: SubscriptionForm) => {
    const {
      createSubscription,
      dataOrderForm: {
        orderForm: { salesChannel },
      },
      history,
    } = this.props

    const data = this.assembleForm(formikValues, salesChannel as string)

    if (!data) return

    this.setState({ isLoading: true })

    const variables = {
      data,
    }

    createSubscription({ variables })
      .then(result => {
        return history.push(
          `/subscriptions/${result.data?.createSubscription.id}`
        )
      })
      .catch((error: ApolloError) => {
        logGraphQLError({
          error,
          variables,
          runtimeInfo: getRuntimeInfo(),
          type: 'MutationError',
          instance: 'CreateSubscription',
        })
        this.setState({ isLoading: false })
      })
  }

  public render() {
    const { history, runtime } = this.props
    const { isLoading } = this.state

    return (
      <>
        <Header
          title={
            <span className="normal">
              <FormattedMessage id="creation-page.title" />
            </span>
          }
          linkLabel={<FormattedMessage id="creation-page.back-button" />}
          onLinkClick={() => history.push('/subscriptions')}
        />
        <Formik<SubscriptionForm>
          initialValues={INITIAL_STATE}
          onSubmit={this.handleSave}
          validationSchema={VALIDATION_SCHEMA}
        >
          {formik => (
            <Form>
              <SimulationContext
                subscription={this.assembleForm(formik.values)}
              >
                <div className="pa5 pa7-xl flex flex-wrap">
                  <div className="w-100 w-60-xl">
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
                  <div className="w-100 w-40-xl pt6 pt0-xl pl0 pl6-xl">
                    <SummarySection currencyCode={runtime.culture.currency} />
                    <div className="mt7">
                      <Button
                        type="submit"
                        onClick={this.handleSave}
                        isLoading={isLoading}
                        disabled={formik.values.products.length === 0}
                        block
                      >
                        <FormattedMessage id="creation-page.create-subscription-button" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SimulationContext>
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
  nextPurchaseDate: Date
  expirationDate: Date | null
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

type Props = RouteComponentProps &
  InjectedRuntimeContext & {
    createSubscription: (args: {
      variables: CreationArgs
    }) => Promise<MutationResult<CreationResult>>
    dataOrderForm: OrderFormResult
  }

const enhance = compose<Props, {}>(
  withRouter,
  withRuntimeContext,
  graphql(CREATE_MUTATION, { name: 'createSubscription' }),
  graphql(ORDERFORM_QUERY, { name: 'dataOrderForm' })
)

export default enhance(SubscriptionCreationContainer)
