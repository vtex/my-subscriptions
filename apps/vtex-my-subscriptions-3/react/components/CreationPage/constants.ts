import { getFutureDate } from './utils'

export const INSTANCE = 'NewSubscription'

export const TOMORROW = getFutureDate({ date: new Date(), days: 1 })
