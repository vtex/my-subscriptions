import QUERY from '../graphql/subscriptionsGroup.gql'
import { orderGroup, generateSubscriptionsGroup } from '.'

export default {
  request: {
    query: QUERY,
    variables: { id: orderGroup },
  },
  result: {
    data: {
      group: generateSubscriptionsGroup({}),
    },
  },
}
