import React, { Component, createContext } from 'react'

import { withQueryWrapper, getRuntimeInfo } from '../tracking'
import type { Result } from '../graphql/queries/simulation.gql'
import QUERY, { SubscriptionForm } from '../graphql/queries/simulation.gql'

const { Consumer, Provider } = createContext<InjectedSimulationContextProps>({
  getPrice: () => null,
  getTotals: () => [],
  loading: false,
})

class SimulationContainer extends Component<Props> {
  private getPrice = (skuId: string) => {
    const { simulation } = this.props

    if (!simulation) return null

    const skuTotal = simulation.totalsBySimulationItems.find(
      total => total.id === skuId
    )

    return skuTotal?.unitPrice ? skuTotal.unitPrice / 100 : null
  }

  private getTotals = () => {
    const { simulation } = this.props

    return simulation?.totals ?? null
  }

  public render() {
    return (
      <Provider
        value={{
          getTotals: this.getTotals,
          getPrice: this.getPrice,
          loading: this.props.loading ?? false,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

type InnerProps = {
  loading?: boolean
  simulation?: Result['simulation']
}

type OuterProps = {
  subscription: SubscriptionForm | null
}

type Props = InnerProps & OuterProps

export { Consumer as SimulationConsumer, SubscriptionForm }

export interface InjectedSimulationContextProps {
  getPrice: (skuId: string) => number | null
  getTotals: () => Result['simulation']['totals'] | null
  loading: boolean
}

export default withQueryWrapper<Props, Result, OuterProps, InnerProps>({
  workflowInstance: 'SIMULATION_CONTAINER',
  getRuntimeInfo,
  document: QUERY,
  operationOptions: {
    skip: ({ subscription }) => subscription === null,
    props: ({ data }) => ({
      loading: data?.loading,
      simulation: data?.simulation,
    }),
  },
})(SimulationContainer)
