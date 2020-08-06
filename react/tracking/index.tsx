import React, { ComponentType, Component, ErrorInfo } from 'react'
import axios from 'axios'
import SplunkEvents from 'splunk-events'
import { compose } from 'recompose'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { ApolloError } from 'apollo-client'
import { withRuntimeContext, RuntimeContext } from 'vtex.render-runtime'
import { DataProps, OperationOption, graphql, DataValue } from 'react-apollo'
import { DocumentNode } from 'graphql'

import { subscribe, unsubscribe } from './eventManager'

// WorkflowType = 'Track' | 'QueryError' | 'MutationError' | 'UnknownError'

type AppInfo = (
  runtime: RuntimeContext
) => {
  appId: string
  appVersion: string
  service: string
  owner: string
  framework: string
  renderMajor: number
  workspace: string
  production: boolean
}

const splunkEvents = new SplunkEvents()

splunkEvents.config({
  endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
  token: 'bdb546bd-456f-41e2-8c58-00aae10331ab',
  request: axios,
  injectAditionalInfo: true,
})

function appInfo(runtime: RuntimeContext) {
  const { workspace, renderMajor, production } = runtime

  return {
    appId: process.env.VTEX_APP_ID as string,
    appVersion: process.env.VTEX_APP_VERSION as string,
    service: 'Subscriptions',
    owner: 'PostPurchaseXP',
    framework: 'Store@2.x',
    renderMajor: renderMajor ?? 7,
    workspace,
    production,
  }
}

export function logMetric(
  {
    runtime,
    metricName,
    data,
  }: {
    runtime: RuntimeContext
    metricName: string
    data?: Record<string, string | number | undefined>
  },
  getAppInfo: AppInfo = appInfo
) {
  if (!runtime) return

  splunkEvents.logEvent(
    'Important',
    'Info',
    'Track',
    metricName,
    {
      ...getAppInfo(runtime),
      ...data,
    },
    runtime.account
  )
}

export function logAppInfo(
  runtime: RuntimeContext,
  getAppInfo: AppInfo = appInfo
) {
  if (!runtime) return

  const culture = {
    country: runtime.culture.country,
    currency: runtime.culture.currency,
    language: runtime.culture.language,
  }

  logMetric(
    {
      runtime,
      metricName: 'AppUsage',
      data: culture,
    },
    getAppInfo
  )
}

export function logGraphqlError(
  {
    error,
    variables,
    runtime,
    instance,
    type,
  }: {
    error: ApolloError
    variables?: any
    runtime: RuntimeContext
    instance: string
    type: 'QueryError' | 'MutationError'
  },
  getAppInfo: AppInfo = appInfo
) {
  if (!runtime) return

  splunkEvents.logEvent(
    'Critical',
    'Error',
    type,
    instance,
    {
      ...getAppInfo(runtime),
      variables: JSON.stringify(variables),
      error: JSON.stringify(error),
    },
    runtime.account
  )
  splunkEvents.flush()
}

export function logError(
  {
    error,
    instance,
    runtime,
    errorInfo,
  }: {
    error: Error
    errorInfo: ErrorInfo
    runtime: RuntimeContext
    instance: string
  },
  getAppInfo: AppInfo = appInfo
) {
  if (!runtime) return

  splunkEvents.logEvent(
    'Critical',
    'Error',
    'UnknownError',
    instance,
    {
      ...getAppInfo(runtime),
      error: JSON.stringify(error),
      extraInfo: JSON.stringify(errorInfo),
    },
    runtime.account
  )
  splunkEvents.flush()
}

export const withAppInfo = compose(
  withRuntimeContext,
  (ChildComp: ComponentType) => {
    class AppLogger extends Component<{ runtime: RuntimeContext }> {
      public componentDidMount() {
        const { runtime } = this.props

        logAppInfo(runtime)
      }

      public render() {
        return <ChildComp {...this.props} />
      }
    }

    return hoistNonReactStatics<any, any>(AppLogger, ChildComp)
  }
)

function addTrackedData<TProps, TData, TGraphQLVariables, TChildProps>(
  operationOptions: OperationOption<
    TProps,
    TData,
    TGraphQLVariables,
    TChildProps
  > = {}
): OperationOption<TProps, TData, TGraphQLVariables, TChildProps> {
  return {
    ...operationOptions,
    props: (props, prev) =>
      (({
        ...(operationOptions.props ? operationOptions.props(props, prev) : {}),
        trackedData: props.data,
      } as unknown) as TChildProps),
  }
}

export function queryWrapper<
  TProps extends TGraphQLVariables | {} = {},
  TData = {},
  TGraphQLVariables = {},
  TChildProps = Partial<DataProps<TData, TGraphQLVariables>>
>(
  workflowInstance: string,
  document: DocumentNode,
  operationOptions?: OperationOption<
    TProps,
    TData,
    TGraphQLVariables,
    TChildProps
  >
): (
  WrappedComponent: React.ComponentType<TProps & TChildProps>
) => React.ComponentClass<TProps, any> {
  return compose(
    graphql<TProps, TData, TGraphQLVariables, TChildProps>(
      document,
      addTrackedData(operationOptions)
    ),
    withRuntimeContext,
    (ChildComp: ComponentType) => {
      class QueryTracker extends Component<{
        runtime: RuntimeContext
        trackedData?: DataValue<unknown>
      }> {
        private callBack = () => {
          const { runtime, trackedData } = this.props

          if (!trackedData || !trackedData.error) return

          logGraphqlError({
            error: trackedData.error,
            variables: trackedData.variables,
            instance: workflowInstance,
            type: 'QueryError',
            runtime,
          })
        }

        public componentWillUnmount() {
          unsubscribe(workflowInstance)
        }

        public render() {
          const { trackedData, runtime, ...rest } = this.props

          subscribe(workflowInstance, trackedData, this.callBack)

          return <ChildComp {...rest} />
        }
      }

      return hoistNonReactStatics<any, any>(QueryTracker, ChildComp)
    }
  )
}
