import { DataValue } from 'react-apollo'

const events: { [key: string]: number | undefined } = {}

// reference
// https://github.com/apollographql/apollo-client/blob/master/src/core/networkStatus.ts
function isQueryCompleted(networkStatus: number): boolean {
  return networkStatus === 7 || networkStatus === 8
}

export function subscribe(
  workflowInstance: string,
  data: DataValue<unknown>,
  callBack: () => void
) {
  const currentNetwork = data.networkStatus
  const previousNetwork = events[workflowInstance]

  // Didn't change
  if (previousNetwork === currentNetwork) return

  // Update status
  events[workflowInstance] = currentNetwork

  if (isQueryCompleted(currentNetwork)) {
    callBack()
  }
}

export function unsubscribe(workflowInstance: string) {
  delete events[workflowInstance]
}
