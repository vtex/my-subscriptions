import { graphql } from 'react-apollo'

export const main = {
  SplunkMonitoring: () => ({
    logGraphQLError: () => null,
  }),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withQueryWrapper = (_: any, args: any) => {
  return graphql(args.document, args.operationOptions)
}
