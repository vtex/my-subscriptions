import DETAIL_QUERY, { Args } from '../graphql/queries/subscription.gql'
import {
  DEFAULT_SUBSCRIPTION_ID,
  GenerationArgs,
  generateSubscription,
} from './subscriptionFactory'

export const MOCK_ROUTER_PARAM = { subscriptionId: DEFAULT_SUBSCRIPTION_ID }

const variables: Args = { id: DEFAULT_SUBSCRIPTION_ID }

export function generateDetailMock(args?: GenerationArgs) {
  return {
    request: {
      query: DETAIL_QUERY,
      variables,
    },
    result: {
      data: {
        subscription: generateSubscription(args ?? {}),
      },
    },
  }
}
