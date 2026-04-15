import { createContext, useContext } from 'react'

interface FreeTrialContextValue {
  isActivelyInTrial: boolean
}

const FreeTrialContext = createContext<FreeTrialContextValue>({
  isActivelyInTrial: false,
})

export const FreeTrialProvider = FreeTrialContext.Provider

export function useFreeTrial() {
  return useContext(FreeTrialContext)
}
