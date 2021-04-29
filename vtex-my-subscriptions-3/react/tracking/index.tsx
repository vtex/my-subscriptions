import type { RuntimeContext } from 'vtex.render-runtime'
import {
  main,
  withMetric as metricHoc,
  withQueryWrapper as queryHoc,
  types,
} from 'vtex.splunk-monitoring'

const monitoring = new main.SplunkMonitoring({
  token: 'bdb546bd-456f-41e2-8c58-00aae10331ab',
})

export function getRuntimeInfo(runtime: RuntimeContext) {
  const { workspace, renderMajor, production } = runtime

  return {
    appName: process.env.VTEX_APP_NAME as string,
    appVersion: process.env.VTEX_APP_VERSION as string,
    service: 'Subscriptions',
    owner: 'PostPurchaseXP',
    renderMajor: renderMajor ?? 7,
    workspace,
    production,
    account: runtime.account,
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
