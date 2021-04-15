import { RuntimeContext } from 'vtex.render-runtime'
import { logging } from 'vtex.splunk-monitoring'
import { RuntimeInfo } from 'vtex.splunk-monitoring/react/splunk'

logging.setup({ token: 'bdb546bd-456f-41e2-8c58-00aae10331ab' })

export function getRuntimeInfo(runtime: RuntimeContext): RuntimeInfo {
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

export const { logMetric } = logging
export const { logGraphQLError } = logging
export const { logError } = logging
export const { queryWrapper } = logging
export const { withMetric } = logging
