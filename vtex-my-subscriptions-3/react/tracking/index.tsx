import {
  main,
  withMetric as metricHoc,
  withQueryWrapper as queryHoc,
  types,
} from 'vtex.splunk-monitoring'

// my-subscriptions index on splunk
const monitoring = new main.SplunkMonitoring({
  token: 'bdb546bd-456f-41e2-8c58-00aae10331ab',
})

export function getRuntimeInfo(): types.RuntimeInfo {
  const runtime = window?.__RUNTIME__ ?? {}

  const { workspace, renderMajor, production, account } = runtime

  const [appName] = ((process.env.VTEX_APP_ID as string) || '').split('@')

  return {
    appName,
    appVersion: process.env.VTEX_APP_VERSION as string,
    service: 'Subscriptions',
    owner: 'PostPurchaseXP',
    renderMajor,
    workspace,
    production,
    account,
  }
}

export const withMetric = (args: types.WithMetricArgs) =>
  metricHoc(monitoring, args)

export const withQueryWrapper = <TProps, TData, TGraphQLVariables, TChildProps>(
  args: types.WithQueryWrapperArgs<
    TProps,
    TData,
    TGraphQLVariables,
    TChildProps
  >
) => queryHoc(monitoring, args)

export const { logMetric, logGraphQLError, logError } = monitoring
