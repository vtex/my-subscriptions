declare module 'vtex.render-runtime' {
  export interface RuntimeContext {
    account: string
    culture: {
      country: string
      currency: string
      language: string
    }
    production: boolean
    renderMajor?: number
    workspace: string
  }

  export interface InjectedRuntimeContext {
    runtime: RuntimeContext
  }

  export const withRuntimeContext
}
