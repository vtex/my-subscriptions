declare module 'render' {
  export interface RuntimeContext {
    workspace: string
    account: string
  }

  export interface InjectedRuntimeContext {
    runtime: RuntimeContext
  }

  export const withRuntimeContext
}
