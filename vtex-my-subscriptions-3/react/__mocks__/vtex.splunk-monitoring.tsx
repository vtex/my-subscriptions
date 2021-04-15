import { graphql } from 'react-apollo'

export const logging = {
  setup: () => null,
  logGraphQLError: () => null,
  queryWrapper: ({ document, operationOptions }: any) =>
    graphql(document, operationOptions),
}
