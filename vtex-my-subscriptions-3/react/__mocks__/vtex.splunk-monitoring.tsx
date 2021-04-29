import { graphql } from 'react-apollo'

export const logging = {
  setup: () => null,
  logGraphQLError: () => null,
  withQueryWrapper: ({ document, operationOptions }: any) =>
    graphql(document, operationOptions),
}
