declare module 'splunk-events' {
  // https://github.com/vtex/splunkevents-js

  import { AxiosStatic } from 'axios'

  interface Constructable<T> {
    new (): T
  }

  interface ConfigArgs {
    endpoint: string
    token: string
    request: AxiosStatic
    injectAditionalInfo: boolean
  }

  // logEvent(level, type, workflowType, workflowInstance, eventData, account)
  // 'level' is the criticality of the event ('Critical','Important','Debug').
  // 'type' is the type of the event ('Error','Warn','Info').
  // 'workflowType' is an action or a flow's stage in the system.
  // 'workflowInstance' defines what id/element is being processed/executed/created in the workflowType.
  // 'eventData' is an object containing your custom data to send to Splunk. This object should be flat and properties with a 'null' or 'undefined' value will be omitted.
  // 'account' is the accountName (e.g. 'dreamstore','gatewayqa','instoreqa').

  interface Events {
    logEvent: (
      level: 'Critical' | 'Important' | 'Debug',
      type: 'Error' | 'Warn' | 'Info',
      workflowType: string,
      workflowInstance: string,
      eventData: Record<string, string | number | boolean | undefined>,
      account: string
    ) => void
    config: (args: ConfigArgs) => void
    getAdditionalInfo: () => { additional_info: string }
    flush: () => void
  }

  const Splunk: Constructable<Events>

  export default Splunk
}
